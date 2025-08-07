using backend.Data;
using backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProprietaireService : IProprietaireService
    {
        private readonly AgenceImmoDbContext _context;

        public ProprietaireService(AgenceImmoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProprietaireDto>> GetAllProprietairesAsync()
        {
            return await _context.Proprietaires
                .Where(p => p.EstActif)
                .Select(p => new ProprietaireDto
                {
                    Id = p.Id,
                    Nom = p.Nom,
                    Prenom = p.Prenom,
                    Email = p.Email,
                    Telephone = p.Telephone,
                    Adresse = p.Adresse,
                    DateCreation = p.DateCreation,
                    EstActif = p.EstActif,
                    NombreBiens = p.Biens.Count
                })
                .ToListAsync();
        }

        public async Task<ProprietaireDto?> GetProprietaireByIdAsync(int id)
        {
            var proprietaire = await _context.Proprietaires
                .Where(p => p.Id == id && p.EstActif)
                .Select(p => new ProprietaireDto
                {
                    Id = p.Id,
                    Nom = p.Nom,
                    Prenom = p.Prenom,
                    Email = p.Email,
                    Telephone = p.Telephone,
                    Adresse = p.Adresse,
                    DateCreation = p.DateCreation,
                    EstActif = p.EstActif,
                    NombreBiens = p.Biens.Count
                })
                .FirstOrDefaultAsync();

            return proprietaire;
        }

        public async Task<ProprietaireDto> CreateProprietaireAsync(CreateProprietaireDto dto)
        {
            var proprietaire = new Proprietaire
            {
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Email = dto.Email,
                Telephone = dto.Telephone,
                Adresse = dto.Adresse,
                DateCreation = DateTime.Now,
                EstActif = true
            };

            _context.Proprietaires.Add(proprietaire);
            await _context.SaveChangesAsync();

            return new ProprietaireDto
            {
                Id = proprietaire.Id,
                Nom = proprietaire.Nom,
                Prenom = proprietaire.Prenom,
                Email = proprietaire.Email,
                Telephone = proprietaire.Telephone,
                Adresse = proprietaire.Adresse,
                DateCreation = proprietaire.DateCreation,
                EstActif = proprietaire.EstActif,
                NombreBiens = 0
            };
        }

        public async Task<ProprietaireDto?> UpdateProprietaireAsync(int id, CreateProprietaireDto dto)
        {
            var proprietaire = await _context.Proprietaires.FindAsync(id);
            if (proprietaire == null || !proprietaire.EstActif)
                return null;

            proprietaire.Nom = dto.Nom;
            proprietaire.Prenom = dto.Prenom;
            proprietaire.Email = dto.Email;
            proprietaire.Telephone = dto.Telephone;
            proprietaire.Adresse = dto.Adresse;

            await _context.SaveChangesAsync();

            return await GetProprietaireByIdAsync(id);
        }

        public async Task<bool> DeleteProprietaireAsync(int id)
        {
            var proprietaire = await _context.Proprietaires.FindAsync(id);
            if (proprietaire == null)
                return false;

            proprietaire.EstActif = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
