// Backend/Services/IAuthService.cs
namespace backend.Services;

public interface IAuthService
{
    Task<string?> LoginAsync(string username, string password);
}