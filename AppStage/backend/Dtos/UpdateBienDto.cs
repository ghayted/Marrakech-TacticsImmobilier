// Backend/Dtos/UpdateBienDto.cs
namespace backend.Dtos;

public class UpdateBienDto
{
    public string Titre { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Prix { get; set; }
    public string Adresse { get; set; } = string.Empty;
    public string Ville { get; set; } = string.Empty;
    public int Surface { get; set; }
    public int NombreDeChambres { get; set; }
    public int NombreDeSallesDeBain { get; set; }
    public int NombreDeSalons { get; set; }
    public int NombreDeCuisines { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public int TypeDeBienId { get; set; }
    public bool EstDisponible { get; set; } // On ajoute la disponibilité
    public string StatutTransaction { get; set; } = string.Empty; // Et le statut

    public List<int> AmenagementIds { get; set; } = new(); 
    public List<string> ImageUrls { get; set; } = new(); // Ajout du champ pour les images
}