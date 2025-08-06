using backend.Data;

namespace backend.Services;

public interface IAuthService
{
    Task<string?> LoginAsync(string username, string password);
    Task<ClientAuthResult?> ClientLoginAsync(string email, string password);
    Task<ClientAuthResult?> ClientRegisterAsync(string email, string password, string prenom, string nom, string? telephone);
    Task<ClientUserInfo?> GetUserByIdAsync(int userId);
    Task<int> CreateOrFindUserAsync(string email, string prenom, string nom, string? telephone);
}