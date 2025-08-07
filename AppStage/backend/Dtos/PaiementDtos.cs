using System;

namespace backend.Dtos;

public class CreatePaiementDto
{
    public int ReservationId { get; set; }
    public decimal Montant { get; set; }
    public string MethodeDePaiement { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
}

public class PaiementDto
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public decimal Montant { get; set; }
    public DateTime DateDePaiement { get; set; }
    public string MethodeDePaiement { get; set; } = string.Empty;
    public string StatutPaiement { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public string? CheminFacture { get; set; }
    public string? LienFacture { get; set; }
    
    // Client information for frontend display
    public string? ClientTelephone { get; set; }
    public string? ClientNom { get; set; }
    public string? ClientEmail { get; set; }
    public string? BienTitre { get; set; }
    public int? BienImmobilierId { get; set; } // Ajouté pour afficher l'ID du bien
}
