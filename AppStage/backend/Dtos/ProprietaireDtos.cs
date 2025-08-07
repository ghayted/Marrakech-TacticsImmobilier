namespace backend.Dtos
{
    public class CreateProprietaireDto
    {
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Telephone { get; set; } = null!;
        public string Adresse { get; set; } = null!;
    }

    public class ProprietaireDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Telephone { get; set; } = null!;
        public string Adresse { get; set; } = null!;
        public DateTime DateCreation { get; set; }
        public bool EstActif { get; set; }
        public int NombreBiens { get; set; }
    }

    public class UpdateProprietaireDto : CreateProprietaireDto
    {
    }
}
