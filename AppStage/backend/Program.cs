using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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
// ➤ Injection des services personnalisés
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBienImmobilierService, BienImmobilierService>();
// ...
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDashboardService, DashboardService>(); // <-- Ajouter cette ligne
// ...
// ➤ Configurer CORS pour autoriser le frontend React (localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
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
app.UseHttpsRedirection();

// ➤ Servir les fichiers statiques (pour les images uploadées)
app.UseStaticFiles();

// ➤ Utiliser la politique CORS avant les endpoints
app.UseCors("AllowReactApp");

app.UseAuthorization();

// ➤ Mapper les contrôleurs
app.MapControllers();

app.Run();
