using System;

namespace backend.Data;

public partial class Paiement
{
    public int Id { get; set; }

    public int ReservationId { get; set; }

    public decimal Montant { get; set; }

    public DateTime DateDePaiement { get; set; }

    public string MethodeDePaiement { get; set; } = null!; // "Stripe", "PayPal", etc.

    public string StatutPaiement { get; set; } = null!; // "Réussi", "Échoué", "En attente"

    public string TransactionId { get; set; } = null!;

    public string? CheminFacture { get; set; } // Chemin vers le fichier PDF de la facture

    // Relations de navigation
    public virtual Reservation Reservation { get; set; } = null!;
}
