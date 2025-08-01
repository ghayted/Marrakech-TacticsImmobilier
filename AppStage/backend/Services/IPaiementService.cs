using backend.Data;
using backend.Dtos;

namespace backend.Services;

public interface IPaiementService
{
    Task<PaiementDto?> CreatePaiementAsync(CreatePaiementDto paiementDto);
    Task<IEnumerable<PaiementDto>> GetAllPaiementsAsync();
    Task<IEnumerable<PaiementDto>> GetPaiementsByReservationAsync(int reservationId);
    Task<PaiementDto?> GetPaiementByIdAsync(int id);
    Task<string> GenerateFactureAsync(int paiementId);
}
