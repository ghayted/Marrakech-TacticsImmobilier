using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class BiensImmobilier
{
    public int Id { get; set; }

    public string Titre { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Prix { get; set; }

    public string Adresse { get; set; } = null!;

    public string Ville { get; set; } = null!;

    public int Surface { get; set; }

    public DateTime DateDePublication { get; set; }

    public bool EstDisponible { get; set; }

    public int NombreDeChambres { get; set; }

    public int NombreDeSallesDeBain { get; set; }

    public int NombreDeSalons { get; set; }

    public int NombreDeCuisines { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public int TypeDeBienId { get; set; }

    public string StatutTransaction { get; set; } = null!; 

    public decimal? PrixParNuit { get; set; } // Prix par nuit pour les locations


    public virtual ICollection<ImagesBien> ImagesBiens { get; set; } = new List<ImagesBien>();

    public virtual TypesDeBien TypeDeBien { get; set; } = null!;

    public virtual ICollection<Amenagement> Amenagements { get; set; } = new List<Amenagement>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<Disponibilite> Disponibilites { get; set; } = new List<Disponibilite>();
}
