using backend.Dtos;

namespace backend.Services
{
    public interface IProprietaireService
    {
        Task<IEnumerable<ProprietaireDto>> GetAllProprietairesAsync();
        Task<ProprietaireDto?> GetProprietaireByIdAsync(int id);
        Task<ProprietaireDto> CreateProprietaireAsync(CreateProprietaireDto dto);
        Task<ProprietaireDto?> UpdateProprietaireAsync(int id, CreateProprietaireDto dto);
        Task<bool> DeleteProprietaireAsync(int id);
    }
}
