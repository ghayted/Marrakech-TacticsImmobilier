using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpPost("site-view")]
    public async Task<IActionResult> TrackSiteView([FromBody] TrackRequest req)
    {
        await _analyticsService.TrackSiteViewAsync(req?.Path);
        return Ok();
    }

    [HttpPost("bien-view/{bienId}")]
    public async Task<IActionResult> TrackBienView(int bienId, [FromBody] TrackRequest req)
    {
        await _analyticsService.TrackBienViewAsync(bienId, req?.Path);
        return Ok();
    }

    [HttpGet("site/monthly")]
    public async Task<IActionResult> GetSiteMonthly([FromQuery] int year)
    {
        var result = await _analyticsService.GetSiteViewsByMonthAsync(year);
        return Ok(result);
    }

    [HttpGet("bien/{bienId}/monthly")]
    public async Task<IActionResult> GetBienMonthly(int bienId, [FromQuery] int year)
    {
        var result = await _analyticsService.GetBienViewsByMonthAsync(bienId, year);
        return Ok(result);
    }

    [HttpGet("site/count")]
    public async Task<IActionResult> GetSiteCount([FromQuery] int? month, [FromQuery] int? year)
    {
        var count = await _analyticsService.GetSiteViewsCountAsync(month, year);
        return Ok(new { count });
    }

    [HttpGet("bien/{bienId}/count")]
    public async Task<IActionResult> GetBienCount(int bienId, [FromQuery] int? month, [FromQuery] int? year)
    {
        var count = await _analyticsService.GetBienViewsCountAsync(bienId, month, year);
        return Ok(new { count });
    }

    [HttpGet("bien/top")]
    public async Task<IActionResult> GetTopBiens([FromQuery] int month, [FromQuery] int year, [FromQuery] int limit = 5)
    {
        var list = await _analyticsService.GetTopBienViewsAsync(month, year, Math.Max(1, Math.Min(limit, 50)));
        return Ok(list);
    }

    public class TrackRequest
    {
        public string? Path { get; set; }
    }
}


