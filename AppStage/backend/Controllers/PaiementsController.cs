using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaiementsController : ControllerBase
{
    private readonly IPaiementService _paiementService;

    public PaiementsController(IPaiementService paiementService)
    {
        _paiementService = paiementService;
    }

    /// <summary>
    /// Enregistrer un nouveau paiement
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePaiement([FromBody] CreatePaiementDto paiementDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var paiement = await _paiementService.CreatePaiementAsync(paiementDto);
        
        if (paiement == null)
            return BadRequest("Réservation introuvable");

        return CreatedAtAction(nameof(GetPaiementById), new { id = paiement.Id }, paiement);
    }

    /// <summary>
    /// Lister tous les paiements
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllPaiements()
    {
        var paiements = await _paiementService.GetAllPaiementsAsync();
        return Ok(paiements);
    }

    /// <summary>
    /// Obtenir un paiement par ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPaiementById(int id)
    {
        var paiement = await _paiementService.GetPaiementByIdAsync(id);
        
        if (paiement == null)
            return NotFound();

        return Ok(paiement);
    }

    /// <summary>
    /// Lister les paiements d'une réservation
    /// </summary>
    [HttpGet("reservation/{reservationId}")]
    public async Task<IActionResult> GetPaiementsByReservation(int reservationId)
    {
        var paiements = await _paiementService.GetPaiementsByReservationAsync(reservationId);
        return Ok(paiements);
    }

    /// <summary>
    /// Télécharger la facture d'un paiement
    /// </summary>
    [HttpGet("{id}/facture")]
    public async Task<IActionResult> TelechargerFacture(int id)
    {
        var paiement = await _paiementService.GetPaiementByIdAsync(id);
        
        if (paiement == null || string.IsNullOrEmpty(paiement.CheminFacture))
            return NotFound();

        if (!System.IO.File.Exists(paiement.CheminFacture))
            return NotFound("Fichier de facture introuvable");

        var fileBytes = await System.IO.File.ReadAllBytesAsync(paiement.CheminFacture);
        var fileName = $"facture_{paiement.Id}.txt";

        return File(fileBytes, "text/plain", fileName);
    }
}
