using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
namespace backend.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    public DashboardController(IDashboardService dashboardService) { _dashboardService = dashboardService; }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _dashboardService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpGet("get-sql")]
    public IActionResult GetSql([FromServices] AgenceImmoDbContext context)
    {
        try 
        {
            var sql = context.Database.GenerateCreateScript();
            return Content(sql, "text/plain");
        }
        catch (Exception ex)
        {
            return Content(ex.ToString(), "text/plain");
        }
    }
}