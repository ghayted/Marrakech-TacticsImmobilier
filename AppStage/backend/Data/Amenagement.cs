using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class Amenagement
{
    public int Id { get; set; }

    public string Nom { get; set; } = null!;

    public string? Icone { get; set; }

    public virtual ICollection<BiensImmobilier> BienImmobiliers { get; set; } = new List<BiensImmobilier>();
}
