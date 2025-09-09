using System;

namespace backend.Data;

public class AnalyticsEvent
{
    public int Id { get; set; }

    // "site_view" pour une vue globale du site, "bien_view" pour une vue d'annonce
    public string EventType { get; set; } = string.Empty;

    // Optionnel: identifiant du bien immobilier si EventType == "bien_view"
    public int? BienImmobilierId { get; set; }

    // Optionnel: chemin de la page ("/", "/property/12", etc.)
    public string? Path { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


