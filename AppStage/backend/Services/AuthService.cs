// Backend/Services/AuthService.cs
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly AgenceImmoDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AgenceImmoDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

   public async Task<string?> LoginAsync(string username, string password)
{
    Console.WriteLine("--- Début de la tentative de connexion ---");
    Console.WriteLine($"Recherche de l'utilisateur : '{username}'");

    var user = await _context.Utilisateurs.SingleOrDefaultAsync(u => u.NomUtilisateur == username);

    if (user == null)
    {
        Console.WriteLine("ERREUR : Utilisateur non trouvé dans la base de données.");
        Console.WriteLine("--- Fin de la tentative ---");
        return null;
    }

    Console.WriteLine("SUCCÈS : Utilisateur trouvé !");
    Console.WriteLine($"Hash lu depuis la BDD (longueur {user.MotDePasseHashe.Length}) : '{user.MotDePasseHashe}'");
    Console.WriteLine($"Mot de passe fourni par l'utilisateur : '{password}'");

    bool motDePasseValide = BCrypt.Net.BCrypt.Verify(password, user.MotDePasseHashe);

    Console.WriteLine($"La vérification du mot de passe a retourné : {motDePasseValide}");

    if (!motDePasseValide)
    {
        Console.WriteLine("ERREUR : La vérification BCrypt a échoué.");
        Console.WriteLine("--- Fin de la tentative ---");
        return null;
    }

    Console.WriteLine("SUCCÈS : Le mot de passe est correct. Génération du jeton...");

    // ... le reste de votre code pour générer le jeton reste inchangé ...
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "votre_super_cle_secrete_personnelle_doit_etre_longue");
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);

    Console.WriteLine("--- Fin de la tentative (Jeton créé) ---");
    return tokenHandler.WriteToken(token);
}
}