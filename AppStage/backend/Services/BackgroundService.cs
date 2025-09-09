using backend.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace backend.Services;

public class ReservationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ReservationBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1); // Vérifier toutes les heures

    public ReservationBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<ReservationBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Service de mise à jour des réservations terminées démarré");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var reservationService = scope.ServiceProvider.GetRequiredService<IReservationService>();

                await reservationService.UpdateReservationsTermineesAsync();
                
                _logger.LogInformation("Vérification des réservations terminées effectuée");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la mise à jour des réservations terminées");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
