using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProprietairesController : ControllerBase
    {
        private readonly IProprietaireService _proprietaireService;

        public ProprietairesController(IProprietaireService proprietaireService)
        {
            _proprietaireService = proprietaireService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProprietaireDto>>> GetProprietaires()
        {
            var proprietaires = await _proprietaireService.GetAllProprietairesAsync();
            return Ok(proprietaires);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProprietaireDto>> GetProprietaire(int id)
        {
            var proprietaire = await _proprietaireService.GetProprietaireByIdAsync(id);
            if (proprietaire == null)
                return NotFound();

            return Ok(proprietaire);
        }

        [HttpPost]
        public async Task<ActionResult<ProprietaireDto>> CreateProprietaire(CreateProprietaireDto dto)
        {
            var proprietaire = await _proprietaireService.CreateProprietaireAsync(dto);
            return CreatedAtAction(nameof(GetProprietaire), new { id = proprietaire.Id }, proprietaire);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProprietaireDto>> UpdateProprietaire(int id, CreateProprietaireDto dto)
        {
            var proprietaire = await _proprietaireService.UpdateProprietaireAsync(id, dto);
            if (proprietaire == null)
                return NotFound();

            return Ok(proprietaire);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProprietaire(int id)
        {
            var success = await _proprietaireService.DeleteProprietaireAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
