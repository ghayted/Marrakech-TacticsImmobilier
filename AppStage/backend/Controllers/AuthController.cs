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
}

// Classe simple pour représenter la requête de connexion
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}