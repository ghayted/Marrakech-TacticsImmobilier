using System;

namespace backend.Dtos;

public class DisponibiliteDto
{
    public int Id { get; set; }
    public int BienImmobilierId { get; set; }
    public DateTime Date { get; set; }
    public bool EstDisponible { get; set; }
    public decimal? PrixNuit { get; set; }
}

public class CreateDisponibiliteDto
{
    public int BienImmobilierId { get; set; }
    public DateTime Date { get; set; }
    public bool EstDisponible { get; set; } = true;
    public decimal? PrixNuit { get; set; }
}

public class UpdateDisponibiliteDto
{
    public bool EstDisponible { get; set; }
    public decimal? PrixNuit { get; set; }
}

public class VerifierDisponibiliteDto
{
    public int BienImmobilierId { get; set; }
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
}

public class DisponibiliteResultDto
{
    public bool EstDisponible { get; set; }
    public decimal PrixTotal { get; set; }
    public int NombreNuits { get; set; }
    public string Message { get; set; } = string.Empty;
}
