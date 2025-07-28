using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public partial class AgenceImmoDbContext : DbContext
{
    public AgenceImmoDbContext(DbContextOptions<AgenceImmoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Amenagement> Amenagements { get; set; }

    public virtual DbSet<BiensImmobilier> BiensImmobiliers { get; set; }

    public virtual DbSet<ImagesBien> ImagesBiens { get; set; }

    public virtual DbSet<TypesDeBien> TypesDeBiens { get; set; }

    public virtual DbSet<Utilisateur> Utilisateurs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Amenagement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Amenagem__3214EC071346912E");

            entity.Property(e => e.Icone).HasMaxLength(100);
            entity.Property(e => e.Nom).HasMaxLength(100);
        });

        modelBuilder.Entity<BiensImmobilier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BiensImm__3214EC07F5469088");

            entity.Property(e => e.Adresse).HasMaxLength(255);
            entity.Property(e => e.DateDePublication).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.EstDisponible).HasDefaultValue(true);
            entity.Property(e => e.Latitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.NombreDeCuisines).HasDefaultValue(1);
            entity.Property(e => e.Prix).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Titre).HasMaxLength(255);
            entity.Property(e => e.Ville).HasMaxLength(100);

            entity.HasOne(d => d.TypeDeBien).WithMany(p => p.BiensImmobiliers)
                .HasForeignKey(d => d.TypeDeBienId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BiensImmobiliers_TypesDeBien");

            entity.HasMany(d => d.Amenagements).WithMany(p => p.BienImmobiliers)
                .UsingEntity<Dictionary<string, object>>(
                    "BienAmenagement",
                    r => r.HasOne<Amenagement>().WithMany()
                        .HasForeignKey("AmenagementId")
                        .HasConstraintName("FK_BienAmenagements_Amenagements"),
                    l => l.HasOne<BiensImmobilier>().WithMany()
                        .HasForeignKey("BienImmobilierId")
                        .HasConstraintName("FK_BienAmenagements_BiensImmobiliers"),
                    j =>
                    {
                        j.HasKey("BienImmobilierId", "AmenagementId").HasName("PK__BienAmen__DA6A2CF84E5EE8C9");
                        j.ToTable("BienAmenagements");
                    });
        });

        modelBuilder.Entity<ImagesBien>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ImagesBi__3214EC076D865796");

            entity.ToTable("ImagesBien");

            entity.HasOne(d => d.BienImmobilier).WithMany(p => p.ImagesBiens)
                .HasForeignKey(d => d.BienImmobilierId)
                .HasConstraintName("FK_ImagesBien_BiensImmobiliers");
        });

        modelBuilder.Entity<TypesDeBien>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TypesDeB__3214EC07CA4D2CB8");

            entity.ToTable("TypesDeBien");

            entity.Property(e => e.Nom).HasMaxLength(100);
        });

        modelBuilder.Entity<Utilisateur>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Utilisat__3214EC071A1239F9");

            entity.HasIndex(e => e.NomUtilisateur, "UQ__Utilisat__49EDB0E510EF6AD5").IsUnique();

            entity.Property(e => e.NomUtilisateur).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
