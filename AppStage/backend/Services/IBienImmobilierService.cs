
using backend.Data;
using backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services; 

public interface IBienImmobilierService
{
  Task<IEnumerable<BienListDto>> GetAllBiensAsync(
    string? recherche = null, 
    string? typeDeBienNom = null, 
    string? statut = null, 
    string? ville = null, 
    string? quartier = null, // Ajout du paramètre quartier pour correspondre à l'implémentation
    decimal? prixMin = null, 
    decimal? prixMax = null, 
    string? triParPrix = null
);
    Task<BiensImmobilier?> CreateBienAsync(CreateBienDto bienDto); 
    Task<BiensImmobilier?> GetBienByIdAsync(int id); 
    Task<BiensImmobilier?> UpdateBienAsync(int id, UpdateBienDto bienDto); // <-- Ajouter cette ligne
    Task<bool> DeleteBienAsync(int id); // On aura besoin de celle-ci aussi

}