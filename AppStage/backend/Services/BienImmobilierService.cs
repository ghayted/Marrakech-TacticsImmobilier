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
    string? triParDate = null,
    string? dateDebut = null,
    string? dateFin = null,
    int? nombreVoyageurs = null,
    int? proprietaireId = null)
{
    var query = _context.BiensImmobiliers
        .Include(b => b.TypeDeBien)
        .Include(b => b.Amenagements)
        .Include(b => b.ImagesBiens)
        .Include(b => b.Disponibilites) // Inclure les disponibilités
        .AsQueryable();

    if (!string.IsNullOrEmpty(recherche))
    {
        // Permettre la recherche par ID (référence) en plus du titre/ville/adresse
        if (int.TryParse(recherche, out var idRecherche))
        {
            query = query.Where(b => b.Id == idRecherche
                                   || b.Titre.Contains(recherche)
                                   || b.Ville.Contains(recherche)
                                   || b.Adresse.Contains(recherche));
        }
        else
        {
            query = query.Where(b => b.Titre.Contains(recherche)
                                   || b.Ville.Contains(recherche)
                                   || b.Adresse.Contains(recherche));
        }
    }
    if (!string.IsNullOrEmpty(typeDeBienNom))
    {
        query = query.Where(b => b.TypeDeBien.Nom == typeDeBienNom);
    }
    // Déterminer le type de location demandé (nuit/mois) pour adapter filtres et tri
    bool isLocationNuit = false;
    bool isLocationMois = false;
    if (!string.IsNullOrEmpty(statut))
    {
        var s = statut.Trim();
        var sLower = s.ToLowerInvariant();

        // Compat accents + anciennes valeurs
        if (sLower.Contains("louer") && sLower.Contains("mois"))
        {
            isLocationMois = true;
            query = query.Where(b => b.StatutTransaction == "À Louer (Mois)" || b.StatutTransaction == "A Louer (Mois)");
        }
        else if (sLower.Contains("louer"))
        {
            isLocationNuit = true;
            query = query.Where(b => b.StatutTransaction == "À Louer (Nuit)" 
                                   || b.StatutTransaction == "A Louer (Nuit)"
                                   || b.StatutTransaction == "À Louer"
                                   || b.StatutTransaction == "A Louer");
        }
        else if (sLower.Contains("vendre"))
        {
            query = query.Where(b => b.StatutTransaction == "À Vendre" || b.StatutTransaction == "A Vendre");
        }
        else if (sLower.Contains("vendu"))
        {
            query = query.Where(b => b.StatutTransaction == "Vendu");
        }
        else if (sLower.Contains("loué") || sLower.Contains("loue"))
        {
            query = query.Where(b => b.StatutTransaction == "Loué" || b.StatutTransaction == "Loue");
        }
        else
        {
            query = query.Where(b => b.StatutTransaction == statut);
        }
    }

    // En mode location (nuit ou mois), exclure explicitement les biens déjà loués
    if (isLocationNuit || isLocationMois)
    {
        query = query.Where(b => b.StatutTransaction != "Loué" && b.StatutTransaction != "Loue");
    }
    if (!string.IsNullOrEmpty(ville))
        query = query.Where(b => b.Ville == ville);
    if (!string.IsNullOrEmpty(quartier))
        query = query.Where(b => b.Adresse.Contains(quartier)); // Filtre sur l'adresse
    if (prixMin.HasValue)
    {
        if (isLocationNuit)
            query = query.Where(b => b.PrixParNuit.HasValue && b.PrixParNuit.Value >= prixMin.Value);
        else
            query = query.Where(b => b.Prix >= prixMin.Value);
    }
    if (prixMax.HasValue)
    {
        if (isLocationNuit)
            query = query.Where(b => b.PrixParNuit.HasValue && b.PrixParNuit.Value <= prixMax.Value);
        else
            query = query.Where(b => b.Prix <= prixMax.Value);
    }

    // Filtrage par propriétaire
    if (proprietaireId.HasValue)
        query = query.Where(b => b.ProprietaireId == proprietaireId.Value);

    // Filtrage par disponibilité si des dates sont fournies
    if (!string.IsNullOrEmpty(dateDebut) && !string.IsNullOrEmpty(dateFin))
    {
        var dateDebutParsed = DateTime.Parse(dateDebut);
        var dateFinParsed = DateTime.Parse(dateFin);

        // Filtrer les biens qui ont des disponibilités pour toutes les dates demandées
        // Si un bien n'a pas de disponibilités définies, on le considère comme disponible
        query = query.Where(b => 
            !b.Disponibilites.Any() || // Pas de disponibilités définies = disponible
            b.Disponibilites
                .Where(d => d.Date >= dateDebutParsed && d.Date <= dateFinParsed)
                .All(d => d.EstDisponible));
    }

    if (!string.IsNullOrEmpty(triParPrix))
    {
        if (triParPrix.Equals("asc", StringComparison.OrdinalIgnoreCase))
        {
            query = isLocationNuit
                ? query.OrderBy(b => b.PrixParNuit)
                : query.OrderBy(b => b.Prix);
        }
        else if (triParPrix.Equals("desc", StringComparison.OrdinalIgnoreCase))
        {
            query = isLocationNuit
                ? query.OrderByDescending(b => b.PrixParNuit)
                : query.OrderByDescending(b => b.Prix);
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
        PrixParNuit = b.PrixParNuit,
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
        // Normaliser le statut pour compatibilité base: "À Louer (Nuit)" est stocké comme "À Louer"
        var statutNormaliseCreation = (bienDto.StatutTransaction ?? string.Empty).Trim();
        var statutLowerCreation = statutNormaliseCreation.ToLowerInvariant();
        if (statutLowerCreation.Contains("louer") && (statutLowerCreation.Contains("nuit") || statutLowerCreation == "à louer" || statutLowerCreation == "a louer"))
        {
            // Forcer le stockage à "À Louer" pour la location saisonnière
            statutNormaliseCreation = "À Louer";
        }

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
            StatutTransaction = statutNormaliseCreation,
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

        // 4. Gère le propriétaire
        if (bienDto.NouveauProprietaire != null)
        {
            // Créer un nouveau propriétaire
            var proprietaireService = new ProprietaireService(_context);
            var nouveauProprietaire = await proprietaireService.CreateProprietaireAsync(bienDto.NouveauProprietaire);
            nouveauBien.ProprietaireId = nouveauProprietaire.Id;
        }
        else if (bienDto.ProprietaireId.HasValue)
        {
            // Utiliser un propriétaire existant
            nouveauBien.ProprietaireId = bienDto.ProprietaireId.Value;
        }

        // 5. Ajoute le tout à la base de données
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
        // Normaliser le statut pour compatibilité base
        var statutNormaliseUpdate = (bienDto.StatutTransaction ?? string.Empty).Trim();
        var statutLowerUpdate = statutNormaliseUpdate.ToLowerInvariant();
        if (statutLowerUpdate.Contains("louer") && (statutLowerUpdate.Contains("nuit") || statutLowerUpdate == "à louer" || statutLowerUpdate == "a louer"))
        {
            statutNormaliseUpdate = "À Louer";
        }
        bienExistant.StatutTransaction = statutNormaliseUpdate;
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