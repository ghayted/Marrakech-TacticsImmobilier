using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReservationService : IReservationService
{
    private readonly AgenceImmoDbContext _context;
    private readonly IDisponibiliteService _disponibiliteService;
    private readonly IRefundService _refundService;
    private readonly IEmailService _emailService;

    public ReservationService(AgenceImmoDbContext context, IDisponibiliteService disponibiliteService, IRefundService refundService, IEmailService emailService)
    {
        _context = context;
        _disponibiliteService = disponibiliteService;
        _refundService = refundService;
        _emailService = emailService;
    }

    public async Task<ReservationDto?> CreateReservationAsync(CreateReservationDto reservationDto)
    {
        // 1. Vérifier la disponibilité
        var disponibilite = await _disponibiliteService.VerifierDisponibiliteAsync(
            reservationDto.BienImmobilierId, 
            reservationDto.DateDebut, 
            reservationDto.DateFin);

        if (!disponibilite.EstDisponible)
        {
            return null; // Dates non disponibles
        }

        // 2. Calculer le prix total
        var prixTotal = await _disponibiliteService.CalculerPrixTotalAsync(
            reservationDto.BienImmobilierId, 
            reservationDto.DateDebut, 
            reservationDto.DateFin);

        // 3. Créer la réservation
        var reservation = new Reservation
        {
            BienImmobilierId = reservationDto.BienImmobilierId,
            UtilisateurId = reservationDto.UtilisateurId,
            DateDebut = reservationDto.DateDebut,
            DateFin = reservationDto.DateFin,
            NombreDeVoyageurs = reservationDto.NombreDeVoyageurs,
            PrixTotal = prixTotal,
            Statut = "Confirmée", // Statut par défaut modifié
            DateDeReservation = DateTime.UtcNow
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        // 4. Marquer les dates comme indisponibles
        await _disponibiliteService.MarquerIndisponibleAsync(
            reservationDto.BienImmobilierId, 
            reservationDto.DateDebut, 
            reservationDto.DateFin);

        // 5. Envoyer email de confirmation
        try
        {
            var reservationLoaded = await _context.Reservations
                .Include(r => r.Utilisateur)
                .Include(r => r.BienImmobilier)
                .FirstOrDefaultAsync(r => r.Id == reservation.Id);

            if (reservationLoaded?.Utilisateur?.Email is string email && !string.IsNullOrWhiteSpace(email))
            {
                var subject = $"Confirmation de réservation – {reservationLoaded.BienImmobilier?.Titre}";
                var body = $"Bonjour {reservationLoaded.Utilisateur.NomComplet ?? reservationLoaded.Utilisateur.NomUtilisateur},\n\n" +
                           $"Votre réservation est confirmée du {reservation.DateDebut:dd/MM/yyyy} au {reservation.DateFin:dd/MM/yyyy} pour {reservation.NombreDeVoyageurs} voyageur(s).\n" +
                           $"Montant total: {reservation.PrixTotal:F2} €\n\n" +
                           "Merci pour votre confiance.";
                await _emailService.SendEmailAsync(email, subject, body);
            }
        }
        catch { /* ne bloque pas le flux si l'email échoue */ }

        // 6. Retourner le DTO
        return await GetReservationByIdAsync(reservation.Id);
    }

    public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(int? reservationId = null, int? clientId = null, string? status = null, string? search = null)
    {
        // Mettre à jour automatiquement les réservations terminées avant de récupérer les données
        await UpdateReservationsTermineesAsync();

        var query = _context.Reservations
            .Include(r => r.BienImmobilier)
            .Include(r => r.Utilisateur)
            .AsQueryable();

        // Appliquer les filtres
        if (reservationId.HasValue)
        {
            query = query.Where(r => r.Id == reservationId.Value);
        }

        if (clientId.HasValue)
        {
            query = query.Where(r => r.UtilisateurId == clientId.Value);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Statut == status);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(r => 
                r.Utilisateur.NomUtilisateur.Contains(search) ||
                r.Utilisateur.Email.Contains(search) ||
                r.Utilisateur.Telephone.Contains(search) ||
                r.BienImmobilier.Titre.Contains(search)
            );
        }

        return await query
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BienImmobilierId = r.BienImmobilierId,
                TitreBien = r.BienImmobilier.Titre,
                UtilisateurId = r.UtilisateurId,
                NomUtilisateur = r.Utilisateur.NomUtilisateur,
                EmailUtilisateur = r.Utilisateur.Email,
                TelephoneUtilisateur = r.Utilisateur.Telephone,
                DateDebut = r.DateDebut,
                DateFin = r.DateFin,
                NombreDeVoyageurs = r.NombreDeVoyageurs,
                PrixTotal = r.PrixTotal,
                Statut = r.Statut,
                DateDeReservation = r.DateDeReservation
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ReservationDto>> GetReservationsByUtilisateurAsync(int utilisateurId)
    {
        // Mettre à jour automatiquement les réservations terminées avant de récupérer les données
        await UpdateReservationsTermineesAsync();

        return await _context.Reservations
            .Include(r => r.BienImmobilier)
            .Include(r => r.Utilisateur)
            .Where(r => r.UtilisateurId == utilisateurId)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BienImmobilierId = r.BienImmobilierId,
                TitreBien = r.BienImmobilier.Titre,
                UtilisateurId = r.UtilisateurId,
                NomUtilisateur = r.Utilisateur.NomUtilisateur,
                EmailUtilisateur = r.Utilisateur.Email,
                TelephoneUtilisateur = r.Utilisateur.Telephone,
                DateDebut = r.DateDebut,
                DateFin = r.DateFin,
                NombreDeVoyageurs = r.NombreDeVoyageurs,
                PrixTotal = r.PrixTotal,
                Statut = r.Statut,
                DateDeReservation = r.DateDeReservation
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ReservationDto>> GetReservationsByBienAsync(int bienId)
    {
        return await _context.Reservations
            .Include(r => r.BienImmobilier)
            .Include(r => r.Utilisateur)
            .Where(r => r.BienImmobilierId == bienId)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BienImmobilierId = r.BienImmobilierId,
                TitreBien = r.BienImmobilier.Titre,
                UtilisateurId = r.UtilisateurId,
                NomUtilisateur = r.Utilisateur.NomUtilisateur,
                EmailUtilisateur = r.Utilisateur.Email,
                TelephoneUtilisateur = r.Utilisateur.Telephone,
                DateDebut = r.DateDebut,
                DateFin = r.DateFin,
                NombreDeVoyageurs = r.NombreDeVoyageurs,
                PrixTotal = r.PrixTotal,
                Statut = r.Statut,
                DateDeReservation = r.DateDeReservation
            })
            .ToListAsync();
    }

    public async Task<ReservationDto?> GetReservationByIdAsync(int id)
    {
        // Vérifier et mettre à jour le statut de cette réservation spécifique
        await VerifierEtMettreAJourStatutReservationAsync(id);

        return await _context.Reservations
            .Include(r => r.BienImmobilier)
            .Include(r => r.Utilisateur)
            .Where(r => r.Id == id)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BienImmobilierId = r.BienImmobilierId,
                TitreBien = r.BienImmobilier.Titre,
                UtilisateurId = r.UtilisateurId,
                NomUtilisateur = r.Utilisateur.NomUtilisateur,
                EmailUtilisateur = r.Utilisateur.Email,
                TelephoneUtilisateur = r.Utilisateur.Telephone,
                DateDebut = r.DateDebut,
                DateFin = r.DateFin,
                NombreDeVoyageurs = r.NombreDeVoyageurs,
                PrixTotal = r.PrixTotal,
                Statut = r.Statut,
                DateDeReservation = r.DateDeReservation
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateReservationStatutAsync(int id, string statut)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return false;

        reservation.Statut = statut;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AnnulerReservationAsync(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return false;

        // Utiliser le service de remboursement pour traiter l'annulation complète
        var success = await _refundService.ProcessRefundForReservationAsync(id, "Annulation client");

        if (success)
        {
            try
            {
                var reservationLoaded = await _context.Reservations
                    .Include(r => r.Utilisateur)
                    .Include(r => r.BienImmobilier)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservationLoaded?.Utilisateur?.Email is string email && !string.IsNullOrWhiteSpace(email))
                {
                    var subject = $"Annulation de réservation – {reservationLoaded.BienImmobilier?.Titre}";
                    var body = $"Bonjour {reservationLoaded.Utilisateur.NomComplet ?? reservationLoaded.Utilisateur.NomUtilisateur},\n\n" +
                               $"Votre réservation du {reservationLoaded.DateDebut:dd/MM/yyyy} au {reservationLoaded.DateFin:dd/MM/yyyy} a été annulée.\n" +
                               "Le remboursement applicable sera traité selon la politique d'annulation.\n\n" +
                               "Cordialement.";
                    await _emailService.SendEmailAsync(email, subject, body);
                }
            }
            catch { }
        }

        return success;
    }

    /// <summary>
    /// Met à jour automatiquement le statut des réservations terminées
    /// </summary>
    public async Task UpdateReservationsTermineesAsync()
    {
        var aujourdhui = DateTime.UtcNow.Date;
        
        // Récupérer toutes les réservations confirmées dont la date de fin est passée
        var reservationsTerminees = await _context.Reservations
            .Where(r => r.Statut == "Confirmée" && r.DateFin.Date < aujourdhui)
            .ToListAsync();

        foreach (var reservation in reservationsTerminees)
        {
            reservation.Statut = "Terminée";
            
            // Libérer le bien immobilier en marquant les dates comme disponibles
            await LibererBienApresReservationAsync(reservation);
        }

        if (reservationsTerminees.Any())
        {
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Vérifie et met à jour le statut d'une réservation spécifique
    /// </summary>
    public async Task<bool> VerifierEtMettreAJourStatutReservationAsync(int reservationId)
    {
        var reservation = await _context.Reservations.FindAsync(reservationId);
        if (reservation == null) return false;

        var aujourdhui = DateTime.UtcNow.Date;
        
        // Si la réservation est confirmée et que la date de fin est passée
        if (reservation.Statut == "Confirmée" && reservation.DateFin.Date < aujourdhui)
        {
            reservation.Statut = "Terminée";
            
            // Libérer le bien immobilier en marquant les dates comme disponibles
            await LibererBienApresReservationAsync(reservation);
            
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }

    /// <summary>
    /// Libère le bien immobilier après la fin d'une réservation
    /// </summary>
    private async Task LibererBienApresReservationAsync(Reservation reservation)
    {
        try
        {
            // Marquer les dates comme disponibles dans la table Disponibilite
            await _disponibiliteService.LibererDatesReservationAsync(
                reservation.BienImmobilierId, 
                reservation.DateDebut, 
                reservation.DateFin);
        }
        catch (Exception ex)
        {
            // Log l'erreur mais ne pas faire échouer la mise à jour du statut
            // On pourrait ajouter un logger ici si nécessaire
            Console.WriteLine($"Erreur lors de la libération du bien {reservation.BienImmobilierId}: {ex.Message}");
        }
    }
}
