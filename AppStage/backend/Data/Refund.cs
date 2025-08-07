using System;

namespace backend.Data;

public partial class Refund
{
    public int Id { get; set; }

    public int ReservationId { get; set; }

    public int PaiementId { get; set; }

    public decimal MontantRembourse { get; set; }

    public DateTime DateDeRemboursement { get; set; }

    public string StatutRemboursement { get; set; } = null!; // "En cours", "Réussi", "Échoué"

    public string MethodeDeRemboursement { get; set; } = null!; // "Stripe", "PayPal", etc.

    public string TransactionIdRemboursement { get; set; } = null!;

    public string? RaisonRemboursement { get; set; } // "Annulation client", "Problème technique", etc.

    public string? CheminFactureRemboursement { get; set; } // Chemin vers le fichier PDF de la facture de remboursement

    // Relations de navigation
    public virtual Reservation Reservation { get; set; } = null!;
    public virtual Paiement Paiement { get; set; } = null!;
} 