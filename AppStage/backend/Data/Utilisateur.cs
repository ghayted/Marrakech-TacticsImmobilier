using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class Utilisateur
{
    public int Id { get; set; }

    public string NomUtilisateur { get; set; } = null!;

    public string MotDePasseHashe { get; set; } = null!;

    public string? Email { get; set; }

    public string? NomComplet { get; set; }

    public string? Telephone { get; set; }

    // Relations de navigation
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
