using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationsController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    /// <summary>
    /// Créer une nouvelle réservation
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto reservationDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var reservation = await _reservationService.CreateReservationAsync(reservationDto);
        
        if (reservation == null)
            return BadRequest("Les dates sélectionnées ne sont pas disponibles");

        return CreatedAtAction(nameof(GetReservationById), new { id = reservation.Id }, reservation);
    }

    /// <summary>
    /// Lister toutes les réservations avec filtres optionnels
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllReservations(
        [FromQuery] int? reservationId = null,
        [FromQuery] int? clientId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var reservations = await _reservationService.GetAllReservationsAsync(reservationId, clientId, status, search);
        return Ok(reservations);
    }

    /// <summary>
    /// Obtenir une réservation par ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReservationById(int id)
    {
        var reservation = await _reservationService.GetReservationByIdAsync(id);
        
        if (reservation == null)
            return NotFound();

        return Ok(reservation);
    }

    /// <summary>
    /// Lister les réservations d'un utilisateur
    /// </summary>
    [HttpGet("utilisateur/{utilisateurId}")]
    public async Task<IActionResult> GetReservationsByUtilisateur(int utilisateurId)
    {
        var reservations = await _reservationService.GetReservationsByUtilisateurAsync(utilisateurId);
        return Ok(reservations);
    }

    /// <summary>
    /// Lister les réservations d'un bien immobilier
    /// </summary>
    [HttpGet("bien/{bienId}")]
    public async Task<IActionResult> GetReservationsByBien(int bienId)
    {
        var reservations = await _reservationService.GetReservationsByBienAsync(bienId);
        return Ok(reservations);
    }

    /// <summary>
    /// Mettre à jour le statut d'une réservation
    /// </summary>
    [HttpPut("{id}/statut")]
    public async Task<IActionResult> UpdateReservationStatut(int id, [FromBody] UpdateReservationStatutDto statutDto)
    {
        var success = await _reservationService.UpdateReservationStatutAsync(id, statutDto.Statut);
        
        if (!success)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Annuler une réservation
    /// </summary>
    [HttpPut("{id}/annuler")]
    public async Task<IActionResult> AnnulerReservation(int id)
    {
        var success = await _reservationService.AnnulerReservationAsync(id);
        
        if (!success)
            return NotFound();

        return NoContent();
    }
}
