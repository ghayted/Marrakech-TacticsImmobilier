using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class Reservation
{
    public int Id { get; set; }

    public int BienImmobilierId { get; set; }

    public int UtilisateurId { get; set; }

    public DateTime DateDebut { get; set; }

    public DateTime DateFin { get; set; }

    public int NombreDeVoyageurs { get; set; }

    public decimal PrixTotal { get; set; }

    public string Statut { get; set; } = null!; // "En attente de paiement", "Confirmée", "Annulée"

    public DateTime DateDeReservation { get; set; }

    // Relations de navigation
    public virtual BiensImmobilier BienImmobilier { get; set; } = null!;

    public virtual Utilisateur Utilisateur { get; set; } = null!;

    public virtual ICollection<Paiement> Paiements { get; set; } = new List<Paiement>();
}
