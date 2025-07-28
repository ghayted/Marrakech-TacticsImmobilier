using System;
using System.Collections.Generic;

namespace backend.Data;

public partial class ImagesBien
{
    public int Id { get; set; }

    public string UrlImage { get; set; } = null!;

    public bool EstImagePrincipale { get; set; }

    public int BienImmobilierId { get; set; }

    public virtual BiensImmobilier BienImmobilier { get; set; } = null!;
}
