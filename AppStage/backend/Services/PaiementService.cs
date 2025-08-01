using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace backend.Services;

public class PaiementService : IPaiementService
{
    private readonly AgenceImmoDbContext _context;
    private readonly IReservationService _reservationService;

    public PaiementService(AgenceImmoDbContext context, IReservationService reservationService)
    {
        _context = context;
        _reservationService = reservationService;
    }

    public async Task<PaiementDto?> CreatePaiementAsync(CreatePaiementDto paiementDto)
    {
        // Vérifier que la réservation existe
        var reservation = await _context.Reservations.FindAsync(paiementDto.ReservationId);
        if (reservation == null) return null;

        // Créer le paiement
        var paiement = new Paiement
        {
            ReservationId = paiementDto.ReservationId,
            Montant = paiementDto.Montant,
            DateDePaiement = DateTime.UtcNow,
            MethodeDePaiement = paiementDto.MethodeDePaiement,
            StatutPaiement = "Réussi", // Dans un vrai système, cela viendrait de l'API de paiement
            TransactionId = paiementDto.TransactionId
        };

        _context.Paiements.Add(paiement);
        await _context.SaveChangesAsync();

        // Mettre à jour le statut de la réservation si le paiement couvre le montant total
        var montantTotal = await _context.Paiements
            .Where(p => p.ReservationId == paiementDto.ReservationId && p.StatutPaiement == "Réussi")
            .SumAsync(p => p.Montant);

        if (montantTotal >= reservation.PrixTotal)
        {
            await _reservationService.UpdateReservationStatutAsync(paiementDto.ReservationId, "Confirmée");
        }

        // Générer la facture
        var cheminFacture = await GenerateFactureAsync(paiement.Id);
        paiement.CheminFacture = cheminFacture;
        await _context.SaveChangesAsync();

        return await GetPaiementByIdAsync(paiement.Id);
    }

    public async Task<IEnumerable<PaiementDto>> GetAllPaiementsAsync()
    {
        return await _context.Paiements
            .Select(p => new PaiementDto
            {
                Id = p.Id,
                ReservationId = p.ReservationId,
                Montant = p.Montant,
                DateDePaiement = p.DateDePaiement,
                MethodeDePaiement = p.MethodeDePaiement,
                StatutPaiement = p.StatutPaiement,
                TransactionId = p.TransactionId,
                CheminFacture = p.CheminFacture,
                LienFacture = !string.IsNullOrEmpty(p.CheminFacture) ? $"/factures/{Path.GetFileName(p.CheminFacture)}" : null
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<PaiementDto>> GetPaiementsByReservationAsync(int reservationId)
    {
        return await _context.Paiements
            .Where(p => p.ReservationId == reservationId)
            .Select(p => new PaiementDto
            {
                Id = p.Id,
                ReservationId = p.ReservationId,
                Montant = p.Montant,
                DateDePaiement = p.DateDePaiement,
                MethodeDePaiement = p.MethodeDePaiement,
                StatutPaiement = p.StatutPaiement,
                TransactionId = p.TransactionId,
                CheminFacture = p.CheminFacture,
                LienFacture = !string.IsNullOrEmpty(p.CheminFacture) ? $"/factures/{Path.GetFileName(p.CheminFacture)}" : null
            })
            .ToListAsync();
    }

    public async Task<PaiementDto?> GetPaiementByIdAsync(int id)
    {
        return await _context.Paiements
            .Where(p => p.Id == id)
            .Select(p => new PaiementDto
            {
                Id = p.Id,
                ReservationId = p.ReservationId,
                Montant = p.Montant,
                DateDePaiement = p.DateDePaiement,
                MethodeDePaiement = p.MethodeDePaiement,
                StatutPaiement = p.StatutPaiement,
                TransactionId = p.TransactionId,
                CheminFacture = p.CheminFacture,
                LienFacture = !string.IsNullOrEmpty(p.CheminFacture) ? $"/factures/{Path.GetFileName(p.CheminFacture)}" : null
            })
            .FirstOrDefaultAsync();
    }

    public async Task<string> GenerateFactureAsync(int paiementId)
    {
        var paiement = await _context.Paiements
            .Include(p => p.Reservation)
            .ThenInclude(r => r.BienImmobilier)
            .Include(p => p.Reservation)
            .ThenInclude(r => r.Utilisateur)
            .FirstOrDefaultAsync(p => p.Id == paiementId);

        if (paiement == null) return string.Empty;

        // Créer le dossier factures s'il n'existe pas
        var facturesPath = Path.Combine("wwwroot", "factures");
        Directory.CreateDirectory(facturesPath);

        // Nom du fichier de facture
        var fileName = $"facture_{paiement.Id}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
        var filePath = Path.Combine(facturesPath, fileName);

        // Générer le PDF de facture
        await GenerateFacturePdfAsync(paiement, filePath);

        return filePath;
    }

    private async Task GenerateFacturePdfAsync(Paiement paiement, string filePath)
    {
        await Task.Run(() =>
        {
            using (var document = new Document(PageSize.A4, 50, 50, 25, 25))
            {
                using (var writer = PdfWriter.GetInstance(document, new FileStream(filePath, FileMode.Create)))
                {
                    document.Open();
                    
                    // Titre principal
                    var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, new BaseColor(128, 128, 128));
                    var title = new Paragraph("FACTURE DE PAIEMENT", titleFont)
                    {
                        Alignment = Element.ALIGN_CENTER,
                        SpacingAfter = 20
                    };
                    document.Add(title);

                    // Informations de la facture
                    var normalFont = FontFactory.GetFont(FontFactory.HELVETICA, 10);
                    var boldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
                    
                    document.Add(new Paragraph($"Numéro de facture: FAC-{paiement.Id:D6}", boldFont));
                    document.Add(new Paragraph($"Date d'émission: {DateTime.Now:dd/MM/yyyy HH:mm}", normalFont));
                    document.Add(new Paragraph($"ID Transaction: {paiement.TransactionId}", normalFont));
                    document.Add(new Paragraph(" ")); // Espace

                    // Section Client
                    var sectionTitleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, new BaseColor(128, 128, 128));
                    document.Add(new Paragraph("INFORMATIONS CLIENT", sectionTitleFont) { SpacingBefore = 10, SpacingAfter = 5 });
                    document.Add(new Paragraph(new string('_', 50), normalFont));
                    
                    document.Add(new Paragraph($"Nom: {paiement.Reservation.Utilisateur.NomComplet ?? paiement.Reservation.Utilisateur.NomUtilisateur}", normalFont));
                    document.Add(new Paragraph($"Email: {paiement.Reservation.Utilisateur.Email ?? "Non renseigné"}", normalFont));
                    document.Add(new Paragraph($"Téléphone: {paiement.Reservation.Utilisateur.Telephone ?? "Non renseigné"}", normalFont));
                    document.Add(new Paragraph(" ")); // Espace

                    // Section Réservation
                    document.Add(new Paragraph("DÉTAILS DE LA RÉSERVATION", sectionTitleFont) { SpacingBefore = 10, SpacingAfter = 5 });
                    document.Add(new Paragraph(new string('_', 50), normalFont));
                    
                    document.Add(new Paragraph($"Propriété: {paiement.Reservation.BienImmobilier.Titre}", normalFont));
                    document.Add(new Paragraph($"Adresse: {paiement.Reservation.BienImmobilier.Adresse}, {paiement.Reservation.BienImmobilier.Ville}", normalFont));
                    document.Add(new Paragraph($"Dates de séjour: {paiement.Reservation.DateDebut:dd/MM/yyyy} - {paiement.Reservation.DateFin:dd/MM/yyyy}", normalFont));
                    
                    var nombreNuits = (paiement.Reservation.DateFin - paiement.Reservation.DateDebut).Days;
                    document.Add(new Paragraph($"Nombre de nuits: {nombreNuits}", normalFont));
                    document.Add(new Paragraph($"Nombre de voyageurs: {paiement.Reservation.NombreDeVoyageurs}", normalFont));
                    document.Add(new Paragraph(" ")); // Espace

                    // Section Paiement
                    document.Add(new Paragraph("DÉTAILS DU PAIEMENT", sectionTitleFont) { SpacingBefore = 10, SpacingAfter = 5 });
                    document.Add(new Paragraph(new string('_', 50), normalFont));
                    
                    document.Add(new Paragraph($"Montant payé: {paiement.Montant:C}", boldFont));
                    document.Add(new Paragraph($"Méthode de paiement: {paiement.MethodeDePaiement}", normalFont));
                    document.Add(new Paragraph($"Date de paiement: {paiement.DateDePaiement:dd/MM/yyyy HH:mm}", normalFont));
                    document.Add(new Paragraph($"Statut: {paiement.StatutPaiement}", normalFont));
                    document.Add(new Paragraph(" ")); // Espace

                    document.Add(new Paragraph($"Montant total de la réservation: {paiement.Reservation.PrixTotal:C}", boldFont));
                    document.Add(new Paragraph($"Statut de la réservation: {paiement.Reservation.Statut}", normalFont));
                    document.Add(new Paragraph(" ")); // Espace

                    // Message de remerciement
                    var thankYouFont = FontFactory.GetFont(FontFactory.HELVETICA_OBLIQUE, 12, new BaseColor(128, 128, 128));
                    var thankYou = new Paragraph("Merci pour votre confiance !", thankYouFont)
                    {
                        Alignment = Element.ALIGN_CENTER,
                        SpacingBefore = 30
                    };
                    document.Add(thankYou);

                    document.Close();
                }
            }
        });
    }
}
