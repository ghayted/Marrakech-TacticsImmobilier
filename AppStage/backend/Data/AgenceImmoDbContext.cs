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

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<Paiement> Paiements { get; set; }

    public virtual DbSet<Disponibilite> Disponibilites { get; set; }

    public virtual DbSet<Refund> Refunds { get; set; }

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
            entity.Property(e => e.PrixParNuit).HasColumnType("decimal(18, 2)");
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
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.NomComplet).HasMaxLength(255);
            entity.Property(e => e.Telephone).HasMaxLength(20);
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Reservations__3214EC07");

            entity.Property(e => e.PrixTotal).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Statut).HasMaxLength(50);
            entity.Property(e => e.DateDeReservation).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.BienImmobilier).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.BienImmobilierId)
                .HasConstraintName("FK_Reservations_BiensImmobiliers");

            entity.HasOne(d => d.Utilisateur).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.UtilisateurId)
                .HasConstraintName("FK_Reservations_Utilisateurs");
        });

        modelBuilder.Entity<Paiement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Paiements__3214EC07");

            entity.Property(e => e.Montant).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MethodeDePaiement).HasMaxLength(50);
            entity.Property(e => e.StatutPaiement).HasMaxLength(50);
            entity.Property(e => e.TransactionId).HasMaxLength(255);
            entity.Property(e => e.CheminFacture).HasMaxLength(500);
            entity.Property(e => e.DateDePaiement).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Reservation).WithMany(p => p.Paiements)
                .HasForeignKey(d => d.ReservationId)
                .HasConstraintName("FK_Paiements_Reservations");
        });

        modelBuilder.Entity<Disponibilite>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Disponibilites__3214EC07");

            entity.Property(e => e.PrixNuit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.EstDisponible).HasDefaultValue(true);

            entity.HasOne(d => d.BienImmobilier).WithMany(p => p.Disponibilites)
                .HasForeignKey(d => d.BienImmobilierId)
                .HasConstraintName("FK_Disponibilites_BiensImmobiliers");
        });

        modelBuilder.Entity<Refund>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Refunds__3214EC07");

            entity.Property(e => e.MontantRembourse).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.StatutRemboursement).HasMaxLength(50);
            entity.Property(e => e.MethodeDeRemboursement).HasMaxLength(50);
            entity.Property(e => e.TransactionIdRemboursement).HasMaxLength(255);
            entity.Property(e => e.RaisonRemboursement).HasMaxLength(500);
            entity.Property(e => e.CheminFactureRemboursement).HasMaxLength(500);
            entity.Property(e => e.DateDeRemboursement).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Reservation).WithMany()
                .HasForeignKey(d => d.ReservationId)
                .HasConstraintName("FK_Refunds_Reservations");

            entity.HasOne(d => d.Paiement).WithMany()
                .HasForeignKey(d => d.PaiementId)
                .HasConstraintName("FK_Refunds_Paiements");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
