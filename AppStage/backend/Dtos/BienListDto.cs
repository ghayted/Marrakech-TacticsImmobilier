namespace backend.Dtos;
public class BienListDto
{
    public int Id { get; set; }
    public string Titre { get; set; }
    public string Ville { get; set; }
    public decimal Prix { get; set; }
    public string StatutTransaction { get; set; }
    public string TypeDeBien { get; set; }
    public int TypeDeBienId { get; set; }
    public string ImagePrincipale { get; set; }
    public int NombreDeChambres { get; set; }
    public int Surface { get; set; }
}