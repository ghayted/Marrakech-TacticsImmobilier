using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class Proprietaire
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nom { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        public string Prenom { get; set; } = null!;
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = null!;
        
        [Required]
        [StringLength(20)]
        public string Telephone { get; set; } = null!;
        
        [Required]
        [StringLength(500)]
        public string Adresse { get; set; } = null!;
        
        public DateTime DateCreation { get; set; } = DateTime.Now;
        public bool EstActif { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<BiensImmobilier> Biens { get; set; } = new List<BiensImmobilier>();
    }
}
