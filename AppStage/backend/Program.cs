using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
// Ecouter sur toutes les interfaces pour accès depuis Docker/n8n en dev
// Configuration pour HTTPS en production
builder.WebHost.UseUrls("http://0.0.0.0:5257", "https://0.0.0.0:5258");

// ➤ Ajouter les services nécessaires
builder.Services.AddControllers(); // Active les contrôleurs [ApiController]
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ➤ Configurer Entity Framework avec SQL Server
builder.Services.AddDbContext<AgenceImmoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
// ➤ Configuration JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "votre_super_cle_secrete_personnelle_doit_etre_longue")),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ➤ Injection des services personnalisés
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBienImmobilierService, BienImmobilierService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IPaiementService, PaiementService>();
builder.Services.AddScoped<IDisponibiliteService, DisponibiliteService>();
builder.Services.AddScoped<IRefundService, RefundService>();
builder.Services.AddScoped<IProprietaireService, ProprietaireService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Ajouter le service de tâches en arrière-plan pour les réservations
builder.Services.AddHostedService<ReservationBackgroundService>();

builder.Services.AddHttpClient();
builder.Services.AddHttpClient();
// ...
// ➤ Configurer CORS pour autoriser toutes les requêtes du frontend
builder.Services.AddCors(options =>
{
    // Configuration permissive pour accepter toutes les requêtes
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .SetPreflightMaxAge(TimeSpan.FromSeconds(3600)); // Cache preflight pour 1h
        });
    
    // Configuration spécifique pour votre frontend en production
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://immotactics.live", "http://localhost:5173", "http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
        });
});

var app = builder.Build();

// ➤ Activer Swagger en environnement de développement
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ➤ Middleware
// Forcer HTTPS en production pour éviter les erreurs Mixed Content
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
else
{
    // En développement, permettre HTTP mais préférer HTTPS
    app.UseHttpsRedirection();
}

// ➤ Servir les fichiers statiques (pour les images uploadées et factures)
app.UseStaticFiles();

// ➤ Ajouter des headers de sécurité et de compatibilité
app.Use(async (context, next) =>
{
    // Ajouter des headers CORS supplémentaires pour s'assurer de la compatibilité
    // Déterminer l'origine de la requête
    var origin = context.Request.Headers.Origin.FirstOrDefault();
    var allowedOrigins = new[] { "https://immotactics.live", "http://localhost:5173", "http://localhost:3000" };
    
    if (allowedOrigins.Contains(origin))
    {
        context.Response.Headers.Append("Access-Control-Allow-Origin", origin);
        context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
    }
    else
    {
        context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
    }
    context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
    context.Response.Headers.Append("Access-Control-Max-Age", "3600");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    
    // Gérer les requêtes OPTIONS (preflight)
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.WriteAsync("");
        return;
    }
    
    await next();
});

// ➤ Utiliser la politique CORS avant les endpoints
// Utilise AllowAll en production pour accepter toutes les requêtes
app.UseCors("AllowAll");

// ➤ Middleware d'authentification et d'autorisation
app.UseAuthentication();
app.UseAuthorization();

// ➤ Mapper les contrôleurs
app.MapControllers();

app.Run();
