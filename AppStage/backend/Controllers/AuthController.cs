using backend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.LoginAsync(request.Username, request.Password);

        if (token == null)
        {
            return Unauthorized(); // Mauvais identifiants
        }

        return Ok(new { Token = token });
    }
    [HttpGet("hash/{password}")]
public IActionResult HashPassword(string password)
{
    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
    return Ok(new { Original = password, Hashed = hashedPassword });
}

    /// <summary>
    /// Créer ou trouver un utilisateur client pour une réservation
    /// </summary>
    [HttpPost("create-or-find-user")]
    public async Task<IActionResult> CreateOrFindUser([FromBody] CreateUserRequest request)
    {
        var userId = await _authService.CreateOrFindUserAsync(request.Email, request.Prenom, request.Nom, request.Telephone);
        return Ok(new { UserId = userId });
    }
}

// Classe simple pour représenter la requête de connexion
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// Classe pour créer/trouver un utilisateur client
public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string? Telephone { get; set; }
}