using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DisponibiliteService : IDisponibiliteService
{
    private readonly AgenceImmoDbContext _context;

    public DisponibiliteService(AgenceImmoDbContext context)
    {
        _context = context;
    }

    public async Task<DisponibiliteResultDto> VerifierDisponibiliteAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin)
    {
        var nombreNuits = (dateFin - dateDebut).Days;
        
        if (nombreNuits <= 0)
        {
            return new DisponibiliteResultDto
            {
                EstDisponible = false,
                Message = "La date de fin doit être postérieure à la date de début"
            };
        }

        // Vérifier les réservations existantes (exclure les annulées et terminées)
        var reservationsConflictuelles = await _context.Reservations
            .Where(r => r.BienImmobilierId == bienImmobilierId
                     && r.Statut != "Annulée" && r.Statut != "Terminée"
                     && ((r.DateDebut <= dateDebut && r.DateFin > dateDebut)
                         || (r.DateDebut < dateFin && r.DateFin >= dateFin)
                         || (r.DateDebut >= dateDebut && r.DateFin <= dateFin)))
            .AnyAsync();

        if (reservationsConflictuelles)
        {
            return new DisponibiliteResultDto
            {
                EstDisponible = false,
                Message = "Ces dates sont déjà réservées"
            };
        }

        // Vérifier les disponibilités spécifiques
        var datesIndisponibles = await _context.Disponibilites
            .Where(d => d.BienImmobilierId == bienImmobilierId
                     && d.Date >= dateDebut
                     && d.Date < dateFin
                     && !d.EstDisponible)
            .AnyAsync();

        if (datesIndisponibles)
        {
            return new DisponibiliteResultDto
            {
                EstDisponible = false,
                Message = "Certaines dates ne sont pas disponibles"
            };
        }

        // Calculer le prix total
        var prixTotal = await CalculerPrixTotalAsync(bienImmobilierId, dateDebut, dateFin);

        return new DisponibiliteResultDto
        {
            EstDisponible = true,
            PrixTotal = prixTotal,
            NombreNuits = nombreNuits,
            Message = "Dates disponibles"
        };
    }

    public async Task<IEnumerable<DisponibiliteDto>> GetDisponibilitesByBienAsync(int bienImmobilierId, DateTime? dateDebut = null, DateTime? dateFin = null)
    {
        var query = _context.Disponibilites
            .Where(d => d.BienImmobilierId == bienImmobilierId);

        if (dateDebut.HasValue)
            query = query.Where(d => d.Date >= dateDebut.Value);

        if (dateFin.HasValue)
            query = query.Where(d => d.Date <= dateFin.Value);

        return await query
            .Select(d => new DisponibiliteDto
            {
                Id = d.Id,
                BienImmobilierId = d.BienImmobilierId,
                Date = d.Date,
                EstDisponible = d.EstDisponible,
                PrixNuit = d.PrixNuit
            })
            .OrderBy(d => d.Date)
            .ToListAsync();
    }

    public async Task<DisponibiliteDto?> CreateDisponibiliteAsync(CreateDisponibiliteDto disponibiliteDto)
    {
        // Vérifier si une disponibilité existe déjà pour cette date
        var existante = await _context.Disponibilites
            .FirstOrDefaultAsync(d => d.BienImmobilierId == disponibiliteDto.BienImmobilierId 
                                   && d.Date.Date == disponibiliteDto.Date.Date);

        if (existante != null)
        {
            // Mettre à jour l'existante
            existante.EstDisponible = disponibiliteDto.EstDisponible;
            existante.PrixNuit = disponibiliteDto.PrixNuit;
        }
        else
        {
            // Créer une nouvelle disponibilité
            var disponibilite = new Disponibilite
            {
                BienImmobilierId = disponibiliteDto.BienImmobilierId,
                Date = disponibiliteDto.Date.Date,
                EstDisponible = disponibiliteDto.EstDisponible,
                PrixNuit = disponibiliteDto.PrixNuit
            };

            _context.Disponibilites.Add(disponibilite);
            existante = disponibilite;
        }

        await _context.SaveChangesAsync();

        return new DisponibiliteDto
        {
            Id = existante.Id,
            BienImmobilierId = existante.BienImmobilierId,
            Date = existante.Date,
            EstDisponible = existante.EstDisponible,
            PrixNuit = existante.PrixNuit
        };
    }

    public async Task<bool> UpdateDisponibiliteAsync(int id, UpdateDisponibiliteDto disponibiliteDto)
    {
        var disponibilite = await _context.Disponibilites.FindAsync(id);
        if (disponibilite == null) return false;

        disponibilite.EstDisponible = disponibiliteDto.EstDisponible;
        disponibilite.PrixNuit = disponibiliteDto.PrixNuit;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarquerIndisponibleAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin)
    {
        var dates = new List<DateTime>();
        for (var date = dateDebut.Date; date < dateFin.Date; date = date.AddDays(1))
        {
            dates.Add(date);
        }

        foreach (var date in dates)
        {
            var disponibilite = await _context.Disponibilites
                .FirstOrDefaultAsync(d => d.BienImmobilierId == bienImmobilierId && d.Date.Date == date.Date);

            if (disponibilite != null)
            {
                // Mettre à jour l'existante
                disponibilite.EstDisponible = false;
            }
            else
            {
                // Créer une nouvelle disponibilité
                disponibilite = new Disponibilite
                {
                    BienImmobilierId = bienImmobilierId,
                    Date = date,
                    EstDisponible = false
                };
                _context.Disponibilites.Add(disponibilite);
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Libère les dates d'une réservation terminée en les marquant comme disponibles
    /// </summary>
    public async Task<bool> LibererDatesReservationAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin)
    {
        var dates = new List<DateTime>();
        for (var date = dateDebut.Date; date < dateFin.Date; date = date.AddDays(1))
        {
            dates.Add(date);
        }

        foreach (var date in dates)
        {
            var disponibilite = await _context.Disponibilites
                .FirstOrDefaultAsync(d => d.BienImmobilierId == bienImmobilierId && d.Date.Date == date.Date);

            if (disponibilite != null)
            {
                // Mettre à jour l'existante - marquer comme disponible
                disponibilite.EstDisponible = true;
            }
            else
            {
                // Créer une nouvelle disponibilité - marquer comme disponible
                disponibilite = new Disponibilite
                {
                    BienImmobilierId = bienImmobilierId,
                    Date = date,
                    EstDisponible = true
                };
                _context.Disponibilites.Add(disponibilite);
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<decimal> CalculerPrixTotalAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin)
    {
        var bien = await _context.BiensImmobiliers.FindAsync(bienImmobilierId);
        if (bien == null) return 0;

        decimal prixTotal = 0;
        var nombreNuits = (dateFin - dateDebut).Days;

        // Récupérer les prix spécifiques pour chaque nuit
        var prixSpecifiques = await _context.Disponibilites
            .Where(d => d.BienImmobilierId == bienImmobilierId
                     && d.Date >= dateDebut.Date
                     && d.Date < dateFin.Date
                     && d.PrixNuit.HasValue)
            .ToDictionaryAsync(d => d.Date.Date, d => d.PrixNuit!.Value);

        // Calculer le prix pour chaque nuit
        for (var date = dateDebut.Date; date < dateFin.Date; date = date.AddDays(1))
        {
            if (prixSpecifiques.TryGetValue(date, out var prixSpecifique))
            {
                prixTotal += prixSpecifique;
            }
            else
            {
                // Utiliser le prix par nuit du bien ou le prix de base divisé par 30 (estimation mensuelle)
                prixTotal += bien.PrixParNuit ?? (bien.Prix / 30);
            }
        }

        // Arrondir à 2 décimales
        return Math.Round(prixTotal, 2);
    }
}
