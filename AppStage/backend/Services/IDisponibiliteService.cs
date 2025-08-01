using backend.Data;
using backend.Dtos;

namespace backend.Services;

public interface IDisponibiliteService
{
    Task<DisponibiliteResultDto> VerifierDisponibiliteAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin);
    Task<IEnumerable<DisponibiliteDto>> GetDisponibilitesByBienAsync(int bienImmobilierId, DateTime? dateDebut = null, DateTime? dateFin = null);
    Task<DisponibiliteDto?> CreateDisponibiliteAsync(CreateDisponibiliteDto disponibiliteDto);
    Task<bool> UpdateDisponibiliteAsync(int id, UpdateDisponibiliteDto disponibiliteDto);
    Task<bool> MarquerIndisponibleAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin);
    Task<decimal> CalculerPrixTotalAsync(int bienImmobilierId, DateTime dateDebut, DateTime dateFin);
}
