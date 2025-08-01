using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DisponibilitesController : ControllerBase
{
    private readonly IDisponibiliteService _disponibiliteService;

    public DisponibilitesController(IDisponibiliteService disponibiliteService)
    {
        _disponibiliteService = disponibiliteService;
    }

    /// <summary>
    /// Vérifier les disponibilités pour un bien et une période donnée
    /// </summary>
    [HttpGet("verifier")]
    public async Task<IActionResult> VerifierDisponibilite(
        [FromQuery] int bienImmobilierId,
        [FromQuery] DateTime dateDebut,
        [FromQuery] DateTime dateFin)
    {
        var resultat = await _disponibiliteService.VerifierDisponibiliteAsync(bienImmobilierId, dateDebut, dateFin);
        return Ok(resultat);
    }

    /// <summary>
    /// Obtenir les disponibilités d'un bien pour une période
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetDisponibilites(
        [FromQuery] int bienImmobilierId,
        [FromQuery] DateTime? dateDebut = null,
        [FromQuery] DateTime? dateFin = null)
    {
        var disponibilites = await _disponibiliteService.GetDisponibilitesByBienAsync(bienImmobilierId, dateDebut, dateFin);
        return Ok(disponibilites);
    }

    /// <summary>
    /// Créer ou mettre à jour une disponibilité
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateDisponibilite([FromBody] CreateDisponibiliteDto disponibiliteDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var disponibilite = await _disponibiliteService.CreateDisponibiliteAsync(disponibiliteDto);
        
        if (disponibilite == null)
            return BadRequest("Erreur lors de la création de la disponibilité");

        return CreatedAtAction(nameof(GetDisponibilites), 
            new { bienImmobilierId = disponibilite.BienImmobilierId }, 
            disponibilite);
    }

    /// <summary>
    /// Mettre à jour une disponibilité existante
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDisponibilite(int id, [FromBody] UpdateDisponibiliteDto disponibiliteDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _disponibiliteService.UpdateDisponibiliteAsync(id, disponibiliteDto);
        
        if (!success)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Calculer le prix total pour une période donnée
    /// </summary>
    [HttpGet("prix")]
    public async Task<IActionResult> CalculerPrix(
        [FromQuery] int bienImmobilierId,
        [FromQuery] DateTime dateDebut,
        [FromQuery] DateTime dateFin)
    {
        var prix = await _disponibiliteService.CalculerPrixTotalAsync(bienImmobilierId, dateDebut, dateFin);
        return Ok(new { PrixTotal = prix, NombreNuits = (dateFin - dateDebut).Days });
    }
}
