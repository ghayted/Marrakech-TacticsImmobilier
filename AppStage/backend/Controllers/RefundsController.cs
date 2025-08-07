using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RefundsController : ControllerBase
{
    private readonly IRefundService _refundService;

    public RefundsController(IRefundService refundService)
    {
        _refundService = refundService;
    }

    /// <summary>
    /// Créer un nouveau remboursement
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateRefund([FromBody] CreateRefundDto refundDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var refund = await _refundService.CreateRefundAsync(refundDto);
        
        if (refund == null)
            return BadRequest("Erreur lors de la création du remboursement");

        return CreatedAtAction(nameof(GetRefundById), new { id = refund.Id }, refund);
    }

    /// <summary>
    /// Obtenir un remboursement par ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRefundById(int id)
    {
        var refund = await _refundService.GetRefundByIdAsync(id);
        
        if (refund == null)
            return NotFound();

        return Ok(refund);
    }

    /// <summary>
    /// Lister tous les remboursements
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllRefunds()
    {
        var refunds = await _refundService.GetAllRefundsAsync();
        return Ok(refunds);
    }

    /// <summary>
    /// Lister les remboursements d'une réservation
    /// </summary>
    [HttpGet("reservation/{reservationId}")]
    public async Task<IActionResult> GetRefundsByReservation(int reservationId)
    {
        var refunds = await _refundService.GetRefundsByReservationAsync(reservationId);
        return Ok(refunds);
    }

    /// <summary>
    /// Mettre à jour un remboursement
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRefund(int id, [FromBody] UpdateRefundDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var refund = await _refundService.UpdateRefundAsync(id, updateDto);
        
        if (refund == null)
            return NotFound();

        return Ok(refund);
    }

    /// <summary>
    /// Traiter le remboursement d'une réservation (annulation complète)
    /// </summary>
    [HttpPost("process-reservation/{reservationId}")]
    public async Task<IActionResult> ProcessRefundForReservation(int reservationId, [FromBody] string raison)
    {
        var success = await _refundService.ProcessRefundForReservationAsync(reservationId, raison);
        
        if (!success)
            return BadRequest("Erreur lors du traitement du remboursement");

        return Ok(new { message = "Remboursement traité avec succès" });
    }

    /// <summary>
    /// Confirmer qu'un remboursement a été effectué
    /// </summary>
    [HttpPut("{id}/confirmer")]
    public async Task<IActionResult> ConfirmerRemboursement(int id)
    {
        var success = await _refundService.ConfirmerRemboursementAsync(id);
        
        if (!success)
            return BadRequest("Erreur lors de la confirmation du remboursement");

        return Ok(new { message = "Remboursement confirmé avec succès" });
    }
} 