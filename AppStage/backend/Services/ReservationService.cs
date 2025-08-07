using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReservationService : IReservationService
{
    private readonly AgenceImmoDbContext _context;
    private readonly IDisponibiliteService _disponibiliteService;
    private readonly IRefundService _refundService;

    public ReservationService(AgenceImmoDbContext context, IDisponibiliteService disponibiliteService, IRefundService refundService)
    {
        _context = context;
        _disponibiliteService = disponibiliteService;
        _refundService = refundService;
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

        // 5. Retourner le DTO
        return await GetReservationByIdAsync(reservation.Id);
    }

    public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(int? reservationId = null, int? clientId = null, string? status = null, string? search = null)
    {
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
        
        return success;
    }
}
