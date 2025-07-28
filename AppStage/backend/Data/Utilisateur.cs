using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class Utilisateur
{
    public int Id { get; set; }

    public string NomUtilisateur { get; set; } = null!;

    public string MotDePasseHashe { get; set; } = null!;
}
