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

    // Vérification hardcoded pour l'administrateur
    if (username == "admin" && password == "admin123")
    {
        Console.WriteLine("SUCCÈS : Connexion administrateur validée (hardcoded). Génération du jeton...");

        var adminTokenHandler = new JwtSecurityTokenHandler();
        var adminKey = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "votre_super_cle_secrete_personnelle_doit_etre_longue");
        
        // Ajouter l'information admin aux claims
        var claims = new List<Claim>
        {
            new Claim("id", "0"), // ID fictif pour l'admin
            new Claim("isAdmin", "true"),
            new Claim("username", username)
        };
        
        var adminTokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(adminKey), SecurityAlgorithms.HmacSha256Signature)
        };
        var adminToken = adminTokenHandler.CreateToken(adminTokenDescriptor);

        Console.WriteLine("--- Fin de la tentative (Jeton créé) ---");
        return adminTokenHandler.WriteToken(adminToken);
    }

    // Pour les utilisateurs non-admin, vérifier dans la base de données
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
    var userTokenHandler = new JwtSecurityTokenHandler();
    var userKey = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "votre_super_cle_secrete_personnelle_doit_etre_longue");
    var userTokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(userKey), SecurityAlgorithms.HmacSha256Signature)
    };
    var userToken = userTokenHandler.CreateToken(userTokenDescriptor);

    Console.WriteLine("--- Fin de la tentative (Jeton créé) ---");
    return userTokenHandler.WriteToken(userToken);
}

    /// <summary>
    /// Connexion pour les clients
    /// </summary>
    public async Task<ClientAuthResult?> ClientLoginAsync(string email, string password)
    {
        var user = await _context.Utilisateurs.SingleOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return null;
        }

        bool motDePasseValide = BCrypt.Net.BCrypt.Verify(password, user.MotDePasseHashe);

        if (!motDePasseValide)
        {
            return null;
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "votre_super_cle_secrete_personnelle_doit_etre_longue");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddDays(7), // Token plus long pour les clients
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new ClientAuthResult
        {
            Token = tokenHandler.WriteToken(token),
            User = new ClientUserInfo
            {
                Id = user.Id,
                Email = user.Email,
                NomComplet = user.NomComplet,
                Nom = user.NomComplet?.Split(' ').LastOrDefault() ?? "",
                Prenom = user.NomComplet?.Split(' ').FirstOrDefault() ?? "",
                Telephone = user.Telephone
            }
        };
    }

    /// <summary>
    /// Inscription pour les clients
    /// </summary>
    public async Task<ClientAuthResult?> ClientRegisterAsync(string email, string password, string prenom, string nom, string? telephone)
    {
        // Vérifier si l'email existe déjà
        var existingUser = await _context.Utilisateurs.SingleOrDefaultAsync(u => u.Email == email);
        if (existingUser != null)
        {
            return null;
        }

        // Créer le nouvel utilisateur
        var newUser = new Utilisateur
        {
            Email = email,
            NomComplet = $"{prenom} {nom}",
            Telephone = telephone,
            NomUtilisateur = email,
            MotDePasseHashe = BCrypt.Net.BCrypt.HashPassword(password)
        };

        _context.Utilisateurs.Add(newUser);
        await _context.SaveChangesAsync();

        // Générer le token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "votre_super_cle_secrete_personnelle_doit_etre_longue");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", newUser.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new ClientAuthResult
        {
            Token = tokenHandler.WriteToken(token),
            User = new ClientUserInfo
            {
                Id = newUser.Id,
                Email = newUser.Email,
                NomComplet = newUser.NomComplet,
                Nom = nom,
                Prenom = prenom,
                Telephone = telephone
            }
        };
    }

    /// <summary>
    /// Récupérer un utilisateur par ID
    /// </summary>
    public async Task<ClientUserInfo?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Utilisateurs.FindAsync(userId);
        if (user == null)
        {
            return null;
        }

        return new ClientUserInfo
        {
            Id = user.Id,
            Email = user.Email,
            NomComplet = user.NomComplet,
            Nom = user.NomComplet?.Split(' ').LastOrDefault() ?? "",
            Prenom = user.NomComplet?.Split(' ').FirstOrDefault() ?? "",
            Telephone = user.Telephone
        };
    }

    /// <summary>
    /// Créer ou trouver un utilisateur client pour les réservations
    /// </summary>
    public async Task<int> CreateOrFindUserAsync(string email, string prenom, string nom, string? telephone)
    {
        // 1. Chercher si l'utilisateur existe déjà par email
        var existingUser = await _context.Utilisateurs
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null)
        {
            // Mettre à jour les informations si nécessaire
            existingUser.NomComplet = $"{prenom} {nom}";
            if (!string.IsNullOrEmpty(telephone))
                existingUser.Telephone = telephone;
            
            await _context.SaveChangesAsync();
            return existingUser.Id;
        }

        // 2. Créer un nouvel utilisateur client
        var newUser = new Utilisateur
        {
            Email = email,
            NomComplet = $"{prenom} {nom}",
            Telephone = telephone,
            NomUtilisateur = email, // Utiliser l'email comme nom d'utilisateur
            MotDePasseHashe = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()) // Mot de passe aléatoire
        };

        _context.Utilisateurs.Add(newUser);
        await _context.SaveChangesAsync();
        return newUser.Id;
    }
}

// Classes pour les résultats d'authentification client
public class ClientAuthResult
{
    public string Token { get; set; } = string.Empty;
    public ClientUserInfo User { get; set; } = new();
}

public class ClientUserInfo
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string NomComplet { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string? Telephone { get; set; }
}