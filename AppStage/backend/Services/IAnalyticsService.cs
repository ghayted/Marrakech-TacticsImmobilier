using System.Threading.Tasks;

namespace backend.Services;

public interface IAnalyticsService
{
    Task TrackSiteViewAsync(string? path);
    Task TrackBienViewAsync(int bienImmobilierId, string? path);
    Task<object> GetSiteViewsByMonthAsync(int year);
    Task<object> GetBienViewsByMonthAsync(int bienImmobilierId, int year);
    Task<int> GetBienViewsCountAsync(int bienImmobilierId, int? month, int? year);
    Task<int> GetSiteViewsCountAsync(int? month, int? year);
    Task<object> GetTopBienViewsAsync(int month, int year, int limit);
}


