using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class TypesDeBien
{
    public int Id { get; set; }

    public string Nom { get; set; } = null!;

    public virtual ICollection<BiensImmobilier> BiensImmobiliers { get; set; } = new List<BiensImmobilier>();
}
