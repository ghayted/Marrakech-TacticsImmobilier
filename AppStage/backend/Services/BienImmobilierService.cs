using backend.Dtos;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services; // Assurez-vous que cette ligne est identique à celle de l'interface

public class BienImmobilierService : IBienImmobilierService
{
    private readonly AgenceImmoDbContext _context;

    public BienImmobilierService(AgenceImmoDbContext context)
    {
        _context = context;
    }

public async Task<IEnumerable<BienListDto>> GetAllBiensAsync(
    string? recherche = null, 
    string? typeDeBienNom = null, 
    string? statut = null, 
    string? ville = null, 
    string? quartier = null, // Le paramètre reste pour l'API, mais il filtre sur Adresse
    decimal? prixMin = null, 
    decimal? prixMax = null, 
    string? triParPrix = null,
    string? triParDate = null)
{
    var query = _context.BiensImmobiliers
        .Include(b => b.TypeDeBien)
        .Include(b => b.Amenagements)
        .Include(b => b.ImagesBiens)
        .AsQueryable();

    if (!string.IsNullOrEmpty(recherche))
    {
        query = query.Where(b => b.Titre.Contains(recherche) || b.Ville.Contains(recherche) || b.Adresse.Contains(recherche));
    }
    if (!string.IsNullOrEmpty(typeDeBienNom))
    {
        query = query.Where(b => b.TypeDeBien.Nom == typeDeBienNom);
    }
    if (!string.IsNullOrEmpty(statut))
    {
        query = query.Where(b => b.StatutTransaction == statut);
    }
    if (!string.IsNullOrEmpty(ville))
        query = query.Where(b => b.Ville == ville);
    if (!string.IsNullOrEmpty(quartier))
        query = query.Where(b => b.Adresse.Contains(quartier)); // Filtre sur l'adresse
    if (prixMin.HasValue)
        query = query.Where(b => b.Prix >= prixMin.Value);
    if (prixMax.HasValue)
        query = query.Where(b => b.Prix <= prixMax.Value);
    if (!string.IsNullOrEmpty(triParPrix))
    {
        if (triParPrix.Equals("asc", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderBy(b => b.Prix);
        }
        else if (triParPrix.Equals("desc", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderByDescending(b => b.Prix);
        }
    }
    
    // Tri par date
    if (!string.IsNullOrEmpty(triParDate))
    {
        if (triParDate.Equals("asc", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderBy(b => b.DateDePublication);
        }
        else if (triParDate.Equals("desc", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderByDescending(b => b.DateDePublication);
        }
    }
    else
    {
        // Par défaut, trier par date de publication (plus récent en premier)
        query = query.OrderByDescending(b => b.DateDePublication);
    }
    // Projection sur DTO léger
    return await query.Select(b => new BienListDto
    {
        Id = b.Id,
        Titre = b.Titre,
        Ville = b.Ville,
        Prix = b.Prix,
        StatutTransaction = b.StatutTransaction,
        TypeDeBien = b.TypeDeBien.Nom,
        TypeDeBienId = b.TypeDeBienId,
        ImagePrincipale = b.ImagesBiens
            .Where(img => img.EstImagePrincipale)
            .Select(img => img.UrlImage)
            .FirstOrDefault()
            ?? b.ImagesBiens.Select(img => img.UrlImage).FirstOrDefault(),
        NombreDeChambres = b.NombreDeChambres,
        Surface = b.Surface
    }).ToListAsync();
}
      public async Task<BiensImmobilier?> CreateBienAsync(CreateBienDto bienDto)
    {
        // 1. Crée l'objet principal
        var nouveauBien = new BiensImmobilier
        {
            Titre = bienDto.Titre,
            Description = bienDto.Description,
            Prix = bienDto.Prix,
            Adresse = bienDto.Adresse,
            Ville = bienDto.Ville,

            Surface = bienDto.Surface,
            NombreDeChambres = bienDto.NombreDeChambres,
            NombreDeSallesDeBain = bienDto.NombreDeSallesDeBain,
            NombreDeSalons = bienDto.NombreDeSalons,
            NombreDeCuisines = bienDto.NombreDeCuisines,
            Latitude = bienDto.Latitude,
            Longitude = bienDto.Longitude,
            TypeDeBienId = bienDto.TypeDeBienId,
            StatutTransaction = bienDto.StatutTransaction,
            PrixParNuit = bienDto.PrixParNuit,
            DateDePublication = DateTime.UtcNow,
            EstDisponible = true
        };

        // 2. Gère les aménagements (relation plusieurs-à-plusieurs)
        if (bienDto.AmenagementIds.Any())
        {
            var amenagements = await _context.Amenagements
                .Where(a => bienDto.AmenagementIds.Contains(a.Id))
                .ToListAsync();
            nouveauBien.Amenagements = amenagements;
        }

        // 3. Gère les images (relation un-à-plusieurs)
        if (bienDto.ImageUrls.Any())
        {
            nouveauBien.ImagesBiens = bienDto.ImageUrls.Select((url, index) => new ImagesBien
            {
                UrlImage = url,
                EstImagePrincipale = (index == 0) // La première image est l'image principale
            }).ToList();
        }

        // 4. Ajoute le tout à la base de données
        _context.BiensImmobiliers.Add(nouveauBien);
        await _context.SaveChangesAsync();

        return nouveauBien;
    }
    public async Task<BiensImmobilier?> GetBienByIdAsync(int id)
    {
        return await _context.BiensImmobiliers
            .Include(b => b.TypeDeBien)
            .Include(b => b.Amenagements)
            .Include(b => b.ImagesBiens) 
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<BiensImmobilier?> UpdateBienAsync(int id, UpdateBienDto bienDto)
    {
        var bienExistant = await _context.BiensImmobiliers
            .Include(b => b.Amenagements)
            .Include(b => b.ImagesBiens) // Inclure les images existantes
            .FirstOrDefaultAsync(b => b.Id == id);

        if (bienExistant == null)
        {
            return null; // Le bien à modifier n'a pas été trouvé
        }

        // --- MISE À JOUR COMPLÈTE DE TOUS LES CHAMPS ---
        bienExistant.Titre = bienDto.Titre;
        bienExistant.Description = bienDto.Description;
        bienExistant.Prix = bienDto.Prix;
        bienExistant.Adresse = bienDto.Adresse;
        bienExistant.Ville = bienDto.Ville;

        bienExistant.Surface = bienDto.Surface;
        bienExistant.NombreDeChambres = bienDto.NombreDeChambres;
        bienExistant.NombreDeSallesDeBain = bienDto.NombreDeSallesDeBain;
        bienExistant.NombreDeSalons = bienDto.NombreDeSalons;
        bienExistant.NombreDeCuisines = bienDto.NombreDeCuisines;
        bienExistant.Latitude = bienDto.Latitude;
        bienExistant.Longitude = bienDto.Longitude;
        bienExistant.TypeDeBienId = bienDto.TypeDeBienId;
        bienExistant.StatutTransaction = bienDto.StatutTransaction;
        bienExistant.EstDisponible = bienDto.EstDisponible;
        bienExistant.PrixParNuit = bienDto.PrixParNuit;

        // La logique pour les aménagements
        if (bienDto.AmenagementIds != null)
        {
            var amenagements = await _context.Amenagements
                .Where(a => bienDto.AmenagementIds.Contains(a.Id))
                .ToListAsync();
            bienExistant.Amenagements = amenagements;
        }

        // Gestion des images : supprimer les anciennes et ajouter les nouvelles
        if (bienDto.ImageUrls != null)
        {
            // Supprimer toutes les images existantes
            _context.ImagesBiens.RemoveRange(bienExistant.ImagesBiens);
            
            // Ajouter les nouvelles images
            if (bienDto.ImageUrls.Any())
            {
                bienExistant.ImagesBiens = bienDto.ImageUrls.Select((url, index) => new ImagesBien
                {
                    UrlImage = url,
                    EstImagePrincipale = (index == 0) // La première image est l'image principale
                }).ToList();
            }
        }

        await _context.SaveChangesAsync(); // Sauvegarde toutes les modifications en base de données

        return bienExistant;
    }
// ...
// Dans BienImmobilierService.cs

public async Task<bool> DeleteBienAsync(int id)
{
    var bienExistant = await _context.BiensImmobiliers.FindAsync(id);
    if (bienExistant == null) return false;

    _context.BiensImmobiliers.Remove(bienExistant);
    await _context.SaveChangesAsync();
    return true;
}
}