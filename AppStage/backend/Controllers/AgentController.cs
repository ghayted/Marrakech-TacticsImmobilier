// Controllers/AgentController.cs
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public AgentController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    // Payload attendu depuis le frontend
    public class AgentQuestion
    {
        public string Question { get; set; } = string.Empty;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskAgent([FromBody] AgentQuestion agentQuestion)
    {
        // Récupère la clé API depuis appsettings.json → section "Gemini:ApiKey"
        var geminiApiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrEmpty(geminiApiKey))
        {
            return StatusCode(500, new { message = "La clé API Gemini n'est pas configurée sur le serveur." });
        }

        if (agentQuestion == null || string.IsNullOrWhiteSpace(agentQuestion.Question))
        {
            return BadRequest(new { message = "Le champ 'question' est requis." });
        }

        var client = _httpClientFactory.CreateClient();
        var geminiApiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={geminiApiKey}";

        // On crée le corps de la requête formaté pour l'API Gemini
        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = agentQuestion.Question } } }
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync(geminiApiUrl, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                // Si Gemini renvoie une erreur, on la transmet au front-end
                return StatusCode((int)response.StatusCode, new { message = $"Erreur de l'API Gemini: {responseContent}" });
            }

            // On extrait la réponse textuelle de la structure JSON de Gemini
            using (var jsonResponse = JsonDocument.Parse(responseContent))
            {
                var aiTextResponse = jsonResponse.RootElement
                                          .GetProperty("candidates")[0]
                                          .GetProperty("content")
                                          .GetProperty("parts")[0]
                                          .GetProperty("text")
                                          .GetString();

                return Ok(new { response = aiTextResponse });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur interne du serveur: {ex.Message}" });
        }
    }
}