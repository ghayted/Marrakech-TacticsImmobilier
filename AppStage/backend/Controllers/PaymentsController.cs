using Microsoft.AspNetCore.Mvc;
using Stripe;
using backend.Dtos;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IPaiementService _paiementService;

    public PaymentsController(IConfiguration configuration, IPaiementService paiementService)
    {
        _configuration = configuration;
        _paiementService = paiementService;
        // Configurer Stripe avec votre clé secrète
        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    /// <summary>
    /// Créer une intention de paiement Stripe
    /// </summary>
    [HttpPost("create-payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
    {
        try
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = request.Amount, // Montant en centimes
                Currency = request.Currency ?? "eur",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
                ReceiptEmail = request.CustomerEmail,
                Description = $"Réservation {request.ReservationData?.PropertyTitle} - {request.CustomerName}",
                Metadata = new Dictionary<string, string>
                {
                    ["reservation_id"] = request.ReservationData?.ReservationId?.ToString() ?? "",
                    ["property_id"] = request.ReservationData?.PropertyId?.ToString() ?? "",
                    ["customer_email"] = request.CustomerEmail ?? "",
                    ["customer_name"] = request.CustomerName ?? "",
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return Ok(new { ClientSecret = paymentIntent.ClientSecret });
        }
        catch (StripeException e)
        {
            return BadRequest(new { Error = e.Message });
        }
    }

    /// <summary>
    /// Webhook pour recevoir les événements de Stripe
    /// </summary>
    [HttpPost("webhook")]
    public async Task<IActionResult> HandleStripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _configuration["Stripe:WebhookSecret"]
            );

            // Gérer les différents types d'événements
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    await HandlePaymentSuccess(paymentIntent);
                    break;

                case "payment_intent.payment_failed":
                    var failedPaymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    await HandlePaymentFailure(failedPaymentIntent);
                    break;

                default:
                    Console.WriteLine($"Événement Stripe non géré: {stripeEvent.Type}");
                    break;
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest($"Erreur webhook: {e.Message}");
        }
    }

    private async Task HandlePaymentSuccess(PaymentIntent paymentIntent)
    {
        // Ici vous pouvez mettre à jour votre base de données
        // Par exemple, marquer la réservation comme payée
        Console.WriteLine($"Paiement réussi pour: {paymentIntent.Id}");
        
        if (paymentIntent.Metadata.TryGetValue("reservation_id", out string reservationIdStr) 
            && int.TryParse(reservationIdStr, out int reservationId))
        {
            // TODO: Mettre à jour le statut de la réservation en base
            // await _reservationService.UpdatePaymentStatusAsync(reservationId, "Payée");
        }
    }

    private async Task HandlePaymentFailure(PaymentIntent paymentIntent)
    {
        // Gérer les échecs de paiement
        Console.WriteLine($"Paiement échoué pour: {paymentIntent.Id}");
        
        if (paymentIntent.Metadata.TryGetValue("reservation_id", out string reservationIdStr) 
            && int.TryParse(reservationIdStr, out int reservationId))
        {
            // TODO: Mettre à jour le statut ou annuler la réservation
            // await _reservationService.UpdatePaymentStatusAsync(reservationId, "Échec de paiement");
        }
    }

    /// <summary>
    /// Confirmer un paiement réussi et créer l'entrée de paiement
    /// </summary>
    [HttpPost("confirm-payment")]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
    {
        try
        {
            // Créer l'entrée de paiement
            var createPaiementDto = new CreatePaiementDto
            {
                ReservationId = request.ReservationId,
                Montant = request.Amount / 100m, // Convertir de centimes à euros
                MethodeDePaiement = "Carte bancaire ",
                TransactionId = request.PaymentIntentId
            };

            var paiement = await _paiementService.CreatePaiementAsync(createPaiementDto);
            
            if (paiement == null)
            {
                return BadRequest(new { Error = "Erreur lors de la création du paiement" });
            }

            return Ok(new { 
                Success = true, 
                Message = "Paiement confirmé et facture générée", 
                PaiementId = paiement.Id, 
                FactureUrl = paiement.LienFacture 
            });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { Error = e.Message });
        }
    }
}

// Classes pour les requêtes
public class CreatePaymentIntentRequest
{
    public long Amount { get; set; } // Montant en centimes
    public string? Currency { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerName { get; set; }
    public ReservationDataRequest? ReservationData { get; set; }
}

public class ReservationDataRequest
{
    public int? ReservationId { get; set; }
    public int? PropertyId { get; set; }
    public string? PropertyTitle { get; set; }
    public DateRange? Dates { get; set; }
    public int? Guests { get; set; }
}

public class DateRange
{
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
}

public class ConfirmPaymentRequest
{
    public int ReservationId { get; set; }
    public long Amount { get; set; } // Montant en centimes
    public string PaymentIntentId { get; set; } = string.Empty;
}