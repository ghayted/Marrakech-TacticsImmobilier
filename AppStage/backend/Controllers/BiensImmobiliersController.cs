using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")] // L'URL sera /api/BiensImmobiliers
public class BiensImmobiliersController : ControllerBase
{
    private readonly IBienImmobilierService _bienService;

    // Le service est "injecté" ici par le constructeur
    public BiensImmobiliersController(IBienImmobilierService bienService)
    {
        _bienService = bienService;
    }
// Dans BiensImmobiliersController.cs
[HttpGet]
public async Task<IActionResult> GetAllBiens(
    [FromQuery] string? recherche = null, 
    [FromQuery] string? typeDeBienNom = null, 
    [FromQuery] string? statut = null,
    [FromQuery] string? ville = null,
    [FromQuery] string? quartier = null,
    [FromQuery] decimal? prixMin = null,
    [FromQuery] decimal? prixMax = null,
    [FromQuery] string? triParPrix = null,
    [FromQuery] string? triParDate = null,
    [FromQuery] string? dateDebut = null,
    [FromQuery] string? dateFin = null,
    [FromQuery] int? nombreVoyageurs = null)
{
    var biens = await _bienService.GetAllBiensAsync(recherche, typeDeBienNom, statut, ville, quartier, prixMin, prixMax, triParPrix, triParDate, dateDebut, dateFin, nombreVoyageurs);
    return Ok(biens);
}
    // POINT D'API N°2 : Créer un nouveau bien
    // S'active avec une requête POST sur /api/BiensImmobiliers
    [HttpPost]
    public async Task<IActionResult> CreateBien([FromBody] CreateBienDto bienDto)
    {
        if (bienDto == null)
        {
            return BadRequest();
        }

        var bienCree = await _bienService.CreateBienAsync(bienDto);

        if (bienCree == null)
        {
            return StatusCode(500, "Une erreur s'est produite lors de la création du bien.");
        }
        
        // Renvoie une réponse 201 Created avec l'objet créé et un lien vers la ressource
        return CreatedAtAction(nameof(GetAllBiens), new { id = bienCree.Id }, bienCree);
    }
    [HttpGet("{id}")]
public async Task<IActionResult> GetBienById(int id)
{
    var bien = await _bienService.GetBienByIdAsync(id);
    if (bien == null) return NotFound();
    return Ok(bien);
}

// PUT api/BiensImmobiliers/{id}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateBien(int id, [FromBody] UpdateBienDto bienDto)
{
    var bienMaj = await _bienService.UpdateBienAsync(id, bienDto);
    if (bienMaj == null) return NotFound();
    return NoContent(); // 204 No Content, succès sans rien renvoyer
}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteBien(int id)
{
    var success = await _bienService.DeleteBienAsync(id);
    if (!success) return NotFound();
    return NoContent(); // 204 No Content
}

// Endpoint pour uploader des images
[HttpPost("upload-images")]
public async Task<IActionResult> UploadImages(IFormFileCollection files)
{
    if (files == null || files.Count == 0)
        return BadRequest("Aucun fichier fourni");

    var uploadedUrls = new List<string>();
    
    foreach (var file in files)
    {
        if (file.Length > 0)
        {
            // Générer un nom unique pour le fichier
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine("wwwroot", "uploads", fileName);
            
            // Créer le dossier s'il n'existe pas
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            
            // Sauvegarder le fichier
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            // Retourner l'URL relative
            uploadedUrls.Add($"/uploads/{fileName}");
        }
    }
    
    return Ok(uploadedUrls);
}
}