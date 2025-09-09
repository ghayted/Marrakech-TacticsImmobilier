using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AgenceImmoDbContext _context;
    public AnalyticsService(AgenceImmoDbContext context)
    {
        _context = context;
    }

    public async Task TrackSiteViewAsync(string? path)
    {
        var evt = new AnalyticsEvent
        {
            EventType = "site_view",
            Path = path,
            CreatedAt = DateTime.UtcNow
        };
        _context.Add(evt);
        await _context.SaveChangesAsync();
    }

    public async Task TrackBienViewAsync(int bienImmobilierId, string? path)
    {
        var evt = new AnalyticsEvent
        {
            EventType = "bien_view",
            BienImmobilierId = bienImmobilierId,
            Path = path,
            CreatedAt = DateTime.UtcNow
        };
        _context.Add(evt);
        await _context.SaveChangesAsync();
    }

    public async Task<object> GetSiteViewsByMonthAsync(int year)
    {
        var query = await _context.Set<AnalyticsEvent>()
            .Where(e => e.EventType == "site_view" && e.CreatedAt.Year == year)
            .GroupBy(e => e.CreatedAt.Month)
            .Select(g => new { Month = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = Enumerable.Range(1, 12)
            .Select(m => new { Month = m, Count = query.FirstOrDefault(x => x.Month == m)?.Count ?? 0 })
            .ToList();
        return result;
    }

    public async Task<object> GetBienViewsByMonthAsync(int bienImmobilierId, int year)
    {
        var query = await _context.Set<AnalyticsEvent>()
            .Where(e => e.EventType == "bien_view" && e.BienImmobilierId == bienImmobilierId && e.CreatedAt.Year == year)
            .GroupBy(e => e.CreatedAt.Month)
            .Select(g => new { Month = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = Enumerable.Range(1, 12)
            .Select(m => new { Month = m, Count = query.FirstOrDefault(x => x.Month == m)?.Count ?? 0 })
            .ToList();
        return result;
    }

    public async Task<int> GetBienViewsCountAsync(int bienImmobilierId, int? month, int? year)
    {
        var now = DateTime.UtcNow;
        var y = year ?? now.Year;
        var m = month ?? now.Month;
        return await _context.Set<AnalyticsEvent>()
            .CountAsync(e => e.EventType == "bien_view" && e.BienImmobilierId == bienImmobilierId && e.CreatedAt.Year == y && e.CreatedAt.Month == m);
    }

    public async Task<int> GetSiteViewsCountAsync(int? month, int? year)
    {
        var now = DateTime.UtcNow;
        var y = year ?? now.Year;
        var m = month ?? now.Month;
        return await _context.Set<AnalyticsEvent>()
            .CountAsync(e => e.EventType == "site_view" && e.CreatedAt.Year == y && e.CreatedAt.Month == m);
    }

    public async Task<object> GetTopBienViewsAsync(int month, int year, int limit)
    {
        var grouped = await _context.Set<AnalyticsEvent>()
            .Where(e => e.EventType == "bien_view" && e.BienImmobilierId != null && e.CreatedAt.Year == year && e.CreatedAt.Month == month)
            .GroupBy(e => e.BienImmobilierId)
            .Select(g => new { BienImmobilierId = g.Key!.Value, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(limit)
            .ToListAsync();

        var ids = grouped.Select(x => x.BienImmobilierId).ToList();
        var titles = await _context.BiensImmobiliers
            .Where(b => ids.Contains(b.Id))
            .Select(b => new { b.Id, b.Titre })
            .ToListAsync();

        var titleMap = titles.ToDictionary(t => t.Id, t => t.Titre);
        var result = grouped.Select(x => new
        {
            bienImmobilierId = x.BienImmobilierId,
            titre = titleMap.ContainsKey(x.BienImmobilierId) ? titleMap[x.BienImmobilierId] : $"Bien #{x.BienImmobilierId}",
            count = x.Count
        }).ToList();
        return result;
    }
}


