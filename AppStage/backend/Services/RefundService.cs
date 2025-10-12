using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace backend.Services;

public class RefundService : IRefundService
{
    private readonly AgenceImmoDbContext _context;
    private readonly IDisponibiliteService _disponibiliteService;

    public RefundService(AgenceImmoDbContext context, IDisponibiliteService disponibiliteService)
    {
        _context = context;
        _disponibiliteService = disponibiliteService;
    }

    public async Task<RefundDto?> CreateRefundAsync(CreateRefundDto refundDto)
    {
        // Vérifier que la réservation et le paiement existent
        var reservation = await _context.Reservations.FindAsync(refundDto.ReservationId);
        var paiement = await _context.Paiements.FindAsync(refundDto.PaiementId);
        
        if (reservation == null || paiement == null) return null;

        // Vérifier que le paiement appartient à la réservation
        if (paiement.ReservationId != refundDto.ReservationId) return null;

        // Créer le remboursement
        var refund = new Refund
        {
            ReservationId = refundDto.ReservationId,
            PaiementId = refundDto.PaiementId,
            MontantRembourse = refundDto.MontantRembourse,
            DateDeRemboursement = DateTime.UtcNow,
            StatutRemboursement = "En cours",
            MethodeDeRemboursement = refundDto.MethodeDeRemboursement,
            TransactionIdRemboursement = refundDto.TransactionIdRemboursement,
            RaisonRemboursement = refundDto.RaisonRemboursement
        };

        _context.Refunds.Add(refund);
        
        // Mettre à jour le statut du paiement à "Annulé"
        paiement.StatutPaiement = "Annulé";
        
        await _context.SaveChangesAsync();

        // Générer la facture de remboursement
        var facturePath = await GenerateRefundInvoiceAsync(refund);
        refund.CheminFactureRemboursement = facturePath;
        await _context.SaveChangesAsync();

        return MapToDto(refund);
    }

    public async Task<RefundDto?> GetRefundByIdAsync(int id)
    {
        var refund = await _context.Refunds.FindAsync(id);
        return refund != null ? MapToDto(refund) : null;
    }

    public async Task<IEnumerable<RefundDto>> GetRefundsByReservationAsync(int reservationId)
    {
        var refunds = await _context.Refunds
            .Where(r => r.ReservationId == reservationId)
            .OrderByDescending(r => r.DateDeRemboursement)
            .ToListAsync();
        
        return refunds.Select(MapToDto);
    }

    public async Task<IEnumerable<RefundDto>> GetAllRefundsAsync()
    {
        var refunds = await _context.Refunds
            .OrderByDescending(r => r.DateDeRemboursement)
            .ToListAsync();
        return refunds.Select(MapToDto);
    }

    public async Task<RefundDto?> UpdateRefundAsync(int id, UpdateRefundDto updateDto)
    {
        var refund = await _context.Refunds.FindAsync(id);
        if (refund == null) return null;

        refund.StatutRemboursement = updateDto.StatutRemboursement;
        if (!string.IsNullOrEmpty(updateDto.RaisonRemboursement))
            refund.RaisonRemboursement = updateDto.RaisonRemboursement;

        await _context.SaveChangesAsync();
        return MapToDto(refund);
    }

    public async Task<bool> ProcessRefundForReservationAsync(int reservationId, string raison)
    {
        try
        {
            // 1. Récupérer la réservation et ses paiements
            var reservation = await _context.Reservations
                .Include(r => r.Paiements)
                .FirstOrDefaultAsync(r => r.Id == reservationId);

            if (reservation == null) return false;

            // 2. Calculer le pourcentage de remboursement selon la politique
            var joursAvantReservation = (reservation.DateDebut - DateTime.UtcNow).Days;
            var pourcentageRemboursement = joursAvantReservation <= 5 ? 0.5m : 1.0m; // 50% si ≤ 5 jours, 100% si > 5 jours

            // 3. Traiter chaque paiement de la réservation
            foreach (var paiement in reservation.Paiements.Where(p => p.StatutPaiement == "Réussi"))
            {
                var montantRembourse = paiement.Montant * pourcentageRemboursement;
                
                var refundDto = new CreateRefundDto
                {
                    ReservationId = reservationId,
                    PaiementId = paiement.Id,
                    MontantRembourse = montantRembourse,
                    MethodeDeRemboursement = paiement.MethodeDePaiement,
                    TransactionIdRemboursement = $"REFUND_{paiement.TransactionId}_{DateTime.UtcNow:yyyyMMddHHmmss}",
                    RaisonRemboursement = $"{raison} - Remboursement {(pourcentageRemboursement * 100)}% (annulation {(joursAvantReservation <= 5 ? "≤ 5 jours" : "> 5 jours")} avant réservation)"
                };

                await CreateRefundAsync(refundDto);
                
                // Mettre à jour le statut du paiement à "Annulé"
                paiement.StatutPaiement = "Annulé";
            }

            // 4. Libérer les dates dans la table Disponibilite
            await LibererDatesReservationAsync(reservation);

            // 5. Mettre à jour le statut de la réservation
            reservation.Statut = "Annulée";
            await _context.SaveChangesAsync();

            return true;
        }
        catch
        {
            return false;
        }
    }

public async Task<bool> ConfirmerRemboursementAsync(int id)
{
    try
    {
        var refund = await _context.Refunds.FindAsync(id);
        if (refund == null) return false;

        // Mettre à jour le statut du remboursement
        refund.StatutRemboursement = "Confirmé";
        refund.DateDeRemboursement = DateTime.UtcNow; // Mettre à jour la date de confirmation

        await _context.SaveChangesAsync();
        return true;
    }
    catch
    {
        return false;
    }
}

    private async Task LibererDatesReservationAsync(Reservation reservation)
    {
        var dateDebut = reservation.DateDebut;
        var dateFin = reservation.DateFin;

        // Pour chaque jour de la réservation, créer ou mettre à jour les disponibilités
        for (var date = dateDebut; date < dateFin; date = date.AddDays(1))
        {
            var disponibilite = await _context.Disponibilites
                .FirstOrDefaultAsync(d => d.BienImmobilierId == reservation.BienImmobilierId && d.Date == date);

            if (disponibilite != null)
            {
                // Mettre à jour l'existante
                disponibilite.EstDisponible = true;
            }
            else
            {
                // Créer une nouvelle disponibilité
                disponibilite = new Disponibilite
                {
                    BienImmobilierId = reservation.BienImmobilierId,
                    Date = date,
                    EstDisponible = true
                };
                _context.Disponibilites.Add(disponibilite);
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task<string> GenerateRefundInvoiceAsync(Refund refund)
    {
        // Récupérer toutes les informations nécessaires
        var reservation = await _context.Reservations
            .Include(r => r.BienImmobilier)
            .Include(r => r.Utilisateur)
            .Include(r => r.Paiements)
            .FirstOrDefaultAsync(r => r.Id == refund.ReservationId);

        if (reservation == null) return string.Empty;

        var paiement = await _context.Paiements
            .FirstOrDefaultAsync(p => p.Id == refund.PaiementId);

        var fileName = $"remboursement_{refund.Id}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.pdf";
        var filePath = Path.Combine("wwwroot", "factures", fileName);

        using (var fs = new FileStream(filePath, FileMode.Create))
        {
            var document = new Document();
            var writer = PdfWriter.GetInstance(document, fs);

            document.Open();

            // Titre principal
            var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
            var title = new Paragraph("FACTURE DE REMBOURSEMENT", titleFont);
            title.Alignment = Element.ALIGN_CENTER;
            document.Add(title);
            document.Add(new Paragraph("\n"));

            var normalFont = FontFactory.GetFont(FontFactory.HELVETICA, 12);
            var boldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12);
            var smallFont = FontFactory.GetFont(FontFactory.HELVETICA, 10);

            // Section 1: Informations du remboursement
            document.Add(new Paragraph("INFORMATIONS DU REMBOURSEMENT", boldFont));
            document.Add(new Paragraph("----------------------------------------", normalFont));
            document.Add(new Paragraph($"Numéro de remboursement : {refund.Id}", normalFont));
            document.Add(new Paragraph($"Numéro de réservation : {refund.ReservationId}", normalFont));
            document.Add(new Paragraph($"Numéro de paiement : {refund.PaiementId}", normalFont));
            document.Add(new Paragraph($"Date de remboursement : {refund.DateDeRemboursement:dd/MM/yyyy à HH:mm}", normalFont));
            document.Add(new Paragraph($"Montant remboursé : {refund.MontantRembourse:C}", normalFont));
            document.Add(new Paragraph($"Méthode de remboursement : {refund.MethodeDeRemboursement}", normalFont));
            document.Add(new Paragraph($"Transaction ID : {refund.TransactionIdRemboursement}", normalFont));
            document.Add(new Paragraph($"Raison : {refund.RaisonRemboursement}", normalFont));
            document.Add(new Paragraph($"Statut : {refund.StatutRemboursement}", normalFont));
            document.Add(new Paragraph("\n"));

            // Section 2: Informations du client
            document.Add(new Paragraph("INFORMATIONS DU CLIENT", boldFont));
            document.Add(new Paragraph("----------------------------------------", normalFont));
            document.Add(new Paragraph($"ID Client : {reservation.Utilisateur?.Id.ToString() ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Nom complet : {reservation.Utilisateur?.NomComplet ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Nom d'utilisateur : {reservation.Utilisateur?.NomUtilisateur ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Email : {reservation.Utilisateur?.Email ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Téléphone : {reservation.Utilisateur?.Telephone ?? "N/A"}", normalFont));
            document.Add(new Paragraph("\n"));

            // Section 3: Informations de la réservation
            document.Add(new Paragraph("DÉTAILS DE LA RÉSERVATION ANNULÉE", boldFont));
            document.Add(new Paragraph("----------------------------------------", normalFont));
            document.Add(new Paragraph($"Numéro de réservation : {reservation.Id}", normalFont));
            document.Add(new Paragraph($"Bien immobilier : {reservation.BienImmobilier?.Titre ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"ID du bien : {reservation.BienImmobilier?.Id.ToString() ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Adresse du bien : {reservation.BienImmobilier?.Adresse ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Ville : {reservation.BienImmobilier?.Ville ?? "N/A"}", normalFont));
            document.Add(new Paragraph($"Période de séjour : {reservation.DateDebut:dd/MM/yyyy} - {reservation.DateFin:dd/MM/yyyy}", normalFont));
            document.Add(new Paragraph($"Nombre de voyageurs : {reservation.NombreDeVoyageurs}", normalFont));
            document.Add(new Paragraph($"Prix total de la réservation : {reservation.PrixTotal:C}", normalFont));
            document.Add(new Paragraph($"Statut de la réservation : {reservation.Statut}", normalFont));
            document.Add(new Paragraph("\n"));

            // Section 4: Informations du paiement original
            if (paiement != null)
            {
                document.Add(new Paragraph("INFORMATIONS DU PAIEMENT ORIGINAL", boldFont));
                document.Add(new Paragraph("----------------------------------------", normalFont));
                document.Add(new Paragraph($"Numéro de paiement : {paiement.Id}", normalFont));
                document.Add(new Paragraph($"Montant payé : {paiement.Montant:C}", normalFont));
                document.Add(new Paragraph($"Méthode de paiement : {paiement.MethodeDePaiement}", normalFont));
                document.Add(new Paragraph($"Transaction ID : {paiement.TransactionId}", normalFont));
                document.Add(new Paragraph($"Date de paiement : {paiement.DateDePaiement:dd/MM/yyyy à HH:mm}", normalFont));
                document.Add(new Paragraph($"Statut du paiement : {paiement.StatutPaiement}", normalFont));
                document.Add(new Paragraph("\n"));
            }

            // Section 5: Calcul du remboursement
            document.Add(new Paragraph("CALCUL DU REMBOURSEMENT", boldFont));
            document.Add(new Paragraph("----------------------------------------", normalFont));
            var montantOriginal = paiement?.Montant ?? 0;
            var pourcentageRembourse = montantOriginal > 0 ? (refund.MontantRembourse / montantOriginal) * 100 : 0;
            document.Add(new Paragraph($"Montant original payé : {montantOriginal:C}", normalFont));
            document.Add(new Paragraph($"Montant remboursé : {refund.MontantRembourse:C}", normalFont));
            document.Add(new Paragraph($"Pourcentage remboursé : {pourcentageRembourse:F1}%", normalFont));
            document.Add(new Paragraph("\n"));

            // Section 6: Informations de contact
            document.Add(new Paragraph("INFORMATIONS DE CONTACT", boldFont));
            document.Add(new Paragraph("----------------------------------------", normalFont));
            document.Add(new Paragraph("Pour toute question concernant ce remboursement,", normalFont));
            document.Add(new Paragraph("veuillez contacter notre service client :", normalFont));
            document.Add(new Paragraph("Email : contact@agenceimmomarrakech.com", normalFont));
            document.Add(new Paragraph("Téléphone : +212 5 24 12 34 56", normalFont));
            document.Add(new Paragraph("Adresse : 123 Avenue Mohammed V, Marrakech, Maroc", normalFont));
            document.Add(new Paragraph("\n"));

            // Section 7: Conditions et notes
            document.Add(new Paragraph("CONDITIONS ET NOTES", boldFont));
            document.Add(new Paragraph("----------------------------------------", normalFont));
            document.Add(new Paragraph("• Ce document constitue une preuve officielle de remboursement", smallFont));
            document.Add(new Paragraph("• Le remboursement sera traité selon la méthode de paiement originale", smallFont));
            document.Add(new Paragraph("• Les délais de traitement peuvent varier selon votre banque", smallFont));
            document.Add(new Paragraph("• Conservez ce document pour vos archives", smallFont));
            document.Add(new Paragraph("\n"));

            // Pied de page
            document.Add(new Paragraph("Document généré automatiquement le " + DateTime.UtcNow.ToString("dd/MM/yyyy à HH:mm"), smallFont));

            document.Close();
        }

        return fileName;
    }

    private RefundDto MapToDto(Refund refund)
    {
        return new RefundDto
        {
            Id = refund.Id,
            ReservationId = refund.ReservationId,
            PaiementId = refund.PaiementId,
            MontantRembourse = refund.MontantRembourse,
            DateDeRemboursement = refund.DateDeRemboursement,
            StatutRemboursement = refund.StatutRemboursement,
            MethodeDeRemboursement = refund.MethodeDeRemboursement,
            TransactionIdRemboursement = refund.TransactionIdRemboursement,
            RaisonRemboursement = refund.RaisonRemboursement,
            CheminFactureRemboursement = refund.CheminFactureRemboursement,
            LienFactureRemboursement = !string.IsNullOrEmpty(refund.CheminFactureRemboursement) 
                ? $"http://144.24.30.248:5257/factures/{refund.CheminFactureRemboursement}" 
                : null
        };
    }
} 