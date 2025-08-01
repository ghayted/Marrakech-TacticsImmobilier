using System;

namespace backend.Data;

public partial class Disponibilite
{
    public int Id { get; set; }

    public int BienImmobilierId { get; set; }

    public DateTime Date { get; set; }

    public bool EstDisponible { get; set; } = true;

    public decimal? PrixNuit { get; set; } // Prix spécifique pour cette nuit (peut surcharger le prix de base)

    // Relations de navigation
    public virtual BiensImmobilier BienImmobilier { get; set; } = null!;
}
