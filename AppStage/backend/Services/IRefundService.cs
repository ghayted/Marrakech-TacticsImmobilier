using backend.Dtos;

namespace backend.Services;

public interface IRefundService
{
    Task<RefundDto?> CreateRefundAsync(CreateRefundDto refundDto);
    Task<RefundDto?> GetRefundByIdAsync(int id);
    Task<IEnumerable<RefundDto>> GetRefundsByReservationAsync(int reservationId);
    Task<IEnumerable<RefundDto>> GetAllRefundsAsync();
    Task<RefundDto?> UpdateRefundAsync(int id, UpdateRefundDto updateDto);
    Task<bool> ProcessRefundForReservationAsync(int reservationId, string raison);
    Task<bool> ConfirmerRemboursementAsync(int id);
} 