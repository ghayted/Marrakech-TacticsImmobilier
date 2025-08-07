using System;

namespace backend.Dtos;

public class CreateRefundDto
{
    public int ReservationId { get; set; }
    public int PaiementId { get; set; }
    public decimal MontantRembourse { get; set; }
    public string MethodeDeRemboursement { get; set; } = string.Empty;
    public string TransactionIdRemboursement { get; set; } = string.Empty;
    public string RaisonRemboursement { get; set; } = string.Empty;
}

public class RefundDto
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public int PaiementId { get; set; }
    public decimal MontantRembourse { get; set; }
    public DateTime DateDeRemboursement { get; set; }
    public string StatutRemboursement { get; set; } = string.Empty;
    public string MethodeDeRemboursement { get; set; } = string.Empty;
    public string TransactionIdRemboursement { get; set; } = string.Empty;
    public string? RaisonRemboursement { get; set; }
    public string? CheminFactureRemboursement { get; set; }
    public string? LienFactureRemboursement { get; set; }
}

public class UpdateRefundDto
{
    public string StatutRemboursement { get; set; } = string.Empty;
    public string? RaisonRemboursement { get; set; }
} 