using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DashboardService : IDashboardService
{
    private readonly AgenceImmoDbContext _context;
    public DashboardService(AgenceImmoDbContext context) { _context = context; }

    public async Task<object> GetStatsAsync()
    {
        var total = await _context.BiensImmobiliers.CountAsync();
        var aVendre = await _context.BiensImmobiliers.CountAsync(b => b.StatutTransaction == "À Vendre");
        var aLouer = await _context.BiensImmobiliers.CountAsync(b => b.StatutTransaction == "À Louer");
        var vendusLoues = await _context.BiensImmobiliers.CountAsync(b => !b.EstDisponible);

        return new { total, aVendre, aLouer, vendusLoues };
    }
}