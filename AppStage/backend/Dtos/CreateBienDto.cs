namespace backend.Dtos;

public class CreateBienDto
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
 public string StatutTransaction { get; set; } = "À Vendre";
    // On enverra une liste des IDs des aménagements cochés
    public List<int> AmenagementIds { get; set; } = new(); 
    // On enverra une liste des URLs des images uploadées
    public List<string> ImageUrls { get; set; } = new();
}