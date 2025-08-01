using System;

namespace backend.Dtos;

public class CreateReservationDto
{
    public int BienImmobilierId { get; set; }
    public int UtilisateurId { get; set; }
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    public int NombreDeVoyageurs { get; set; }
}

public class ReservationDto
{
    public int Id { get; set; }
    public int BienImmobilierId { get; set; }
    public string TitreBien { get; set; } = string.Empty;
    public int UtilisateurId { get; set; }
    public string NomUtilisateur { get; set; } = string.Empty;
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    public int NombreDeVoyageurs { get; set; }
    public decimal PrixTotal { get; set; }
    public string Statut { get; set; } = string.Empty;
    public DateTime DateDeReservation { get; set; }
}

public class UpdateReservationStatutDto
{
    public string Statut { get; set; } = string.Empty;
}
