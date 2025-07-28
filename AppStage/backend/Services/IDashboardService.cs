namespace backend.Services; 

public interface IDashboardService
{
    Task<object> GetStatsAsync();
}