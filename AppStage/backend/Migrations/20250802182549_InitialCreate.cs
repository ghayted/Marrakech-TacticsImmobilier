using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Amenagements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icone = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Amenagem__3214EC071346912E", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TypesDeBien",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TypesDeB__3214EC07CA4D2CB8", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomUtilisateur = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MotDePasseHashe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    NomComplet = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Telephone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Utilisat__3214EC071A1239F9", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BiensImmobiliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titre = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prix = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Ville = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Surface = table.Column<int>(type: "int", nullable: false),
                    DateDePublication = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    EstDisponible = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    NombreDeChambres = table.Column<int>(type: "int", nullable: false),
                    NombreDeSallesDeBain = table.Column<int>(type: "int", nullable: false),
                    NombreDeSalons = table.Column<int>(type: "int", nullable: false),
                    NombreDeCuisines = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    Latitude = table.Column<decimal>(type: "decimal(9,6)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(9,6)", nullable: true),
                    TypeDeBienId = table.Column<int>(type: "int", nullable: false),
                    StatutTransaction = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrixParNuit = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BiensImm__3214EC07F5469088", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BiensImmobiliers_TypesDeBien",
                        column: x => x.TypeDeBienId,
                        principalTable: "TypesDeBien",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BienAmenagements",
                columns: table => new
                {
                    BienImmobilierId = table.Column<int>(type: "int", nullable: false),
                    AmenagementId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BienAmen__DA6A2CF84E5EE8C9", x => new { x.BienImmobilierId, x.AmenagementId });
                    table.ForeignKey(
                        name: "FK_BienAmenagements_Amenagements",
                        column: x => x.AmenagementId,
                        principalTable: "Amenagements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BienAmenagements_BiensImmobiliers",
                        column: x => x.BienImmobilierId,
                        principalTable: "BiensImmobiliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Disponibilites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BienImmobilierId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstDisponible = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    PrixNuit = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Disponibilites__3214EC07", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Disponibilites_BiensImmobiliers",
                        column: x => x.BienImmobilierId,
                        principalTable: "BiensImmobiliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImagesBien",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UrlImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstImagePrincipale = table.Column<bool>(type: "bit", nullable: false),
                    BienImmobilierId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ImagesBi__3214EC076D865796", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImagesBien_BiensImmobiliers",
                        column: x => x.BienImmobilierId,
                        principalTable: "BiensImmobiliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BienImmobilierId = table.Column<int>(type: "int", nullable: false),
                    UtilisateurId = table.Column<int>(type: "int", nullable: false),
                    DateDebut = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NombreDeVoyageurs = table.Column<int>(type: "int", nullable: false),
                    PrixTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateDeReservation = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reservations__3214EC07", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservations_BiensImmobiliers",
                        column: x => x.BienImmobilierId,
                        principalTable: "BiensImmobiliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservations_Utilisateurs",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Paiements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    Montant = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DateDePaiement = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    MethodeDePaiement = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StatutPaiement = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TransactionId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CheminFacture = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Paiements__3214EC07", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Paiements_Reservations",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BienAmenagements_AmenagementId",
                table: "BienAmenagements",
                column: "AmenagementId");

            migrationBuilder.CreateIndex(
                name: "IX_BiensImmobiliers_TypeDeBienId",
                table: "BiensImmobiliers",
                column: "TypeDeBienId");

            migrationBuilder.CreateIndex(
                name: "IX_Disponibilites_BienImmobilierId",
                table: "Disponibilites",
                column: "BienImmobilierId");

            migrationBuilder.CreateIndex(
                name: "IX_ImagesBien_BienImmobilierId",
                table: "ImagesBien",
                column: "BienImmobilierId");

            migrationBuilder.CreateIndex(
                name: "IX_Paiements_ReservationId",
                table: "Paiements",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_BienImmobilierId",
                table: "Reservations",
                column: "BienImmobilierId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_UtilisateurId",
                table: "Reservations",
                column: "UtilisateurId");

            migrationBuilder.CreateIndex(
                name: "UQ__Utilisat__49EDB0E510EF6AD5",
                table: "Utilisateurs",
                column: "NomUtilisateur",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BienAmenagements");

            migrationBuilder.DropTable(
                name: "Disponibilites");

            migrationBuilder.DropTable(
                name: "ImagesBien");

            migrationBuilder.DropTable(
                name: "Paiements");

            migrationBuilder.DropTable(
                name: "Amenagements");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "BiensImmobiliers");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "TypesDeBien");
        }
    }
}
