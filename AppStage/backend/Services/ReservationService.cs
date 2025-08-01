using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReservationService : IReservationService
{
    private readonly AgenceImmoDbContext _context;
    private readonly IDisponibiliteService _disponibiliteService;

    public ReservationService(AgenceImmoDbContext context, IDisponibiliteService disponibiliteService)
    {
        _context = context;
        _disponibiliteService = disponibiliteService;
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
            Statut = "En attente de paiement",
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

    public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync()
    {
        return await _context.Reservations
            .Include(r => r.BienImmobilier)
            .Include(r => r.Utilisateur)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BienImmobilierId = r.BienImmobilierId,
                TitreBien = r.BienImmobilier.Titre,
                UtilisateurId = r.UtilisateurId,
                NomUtilisateur = r.Utilisateur.NomUtilisateur,
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

        // Marquer la réservation comme annulée
        reservation.Statut = "Annulée";

        // Libérer les dates (marquer comme disponibles)
        var disponibilites = await _context.Disponibilites
            .Where(d => d.BienImmobilierId == reservation.BienImmobilierId 
                     && d.Date >= reservation.DateDebut 
                     && d.Date < reservation.DateFin)
            .ToListAsync();

        foreach (var dispo in disponibilites)
        {
            dispo.EstDisponible = true;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
