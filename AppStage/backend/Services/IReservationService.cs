using backend.Data;
using backend.Dtos;

namespace backend.Services;

public interface IReservationService
{
    Task<ReservationDto?> CreateReservationAsync(CreateReservationDto reservationDto);
    Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(int? reservationId = null, int? clientId = null, string? status = null, string? search = null);
    Task<IEnumerable<ReservationDto>> GetReservationsByUtilisateurAsync(int utilisateurId);
    Task<IEnumerable<ReservationDto>> GetReservationsByBienAsync(int bienId);
    Task<ReservationDto?> GetReservationByIdAsync(int id);
    Task<bool> UpdateReservationStatutAsync(int id, string statut);
    Task<bool> AnnulerReservationAsync(int id);
}
