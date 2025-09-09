// Controllers/StatsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly AgenceImmoDbContext _context;

    public StatsController(AgenceImmoDbContext context)
    {
        _context = context;
    }

    // GET: api/stats/total-properties
    [HttpGet("total-properties")]
    public async Task<IActionResult> GetTotalProperties()
    {
        var totalCount = await _context.BiensImmobiliers.CountAsync();
        return Ok(new { count = totalCount });
    }
}