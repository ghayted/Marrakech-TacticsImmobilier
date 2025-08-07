using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProprietaireTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProprietaireId",
                table: "BiensImmobiliers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Proprietaires",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    EstActif = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Proprietaires__3214EC07", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Refunds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    PaiementId = table.Column<int>(type: "int", nullable: false),
                    MontantRembourse = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DateDeRemboursement = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    StatutRemboursement = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MethodeDeRemboursement = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TransactionIdRemboursement = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RaisonRemboursement = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CheminFactureRemboursement = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Refunds__3214EC07", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Refunds_Paiements",
                        column: x => x.PaiementId,
                        principalTable: "Paiements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Refunds_Reservations",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BiensImmobiliers_ProprietaireId",
                table: "BiensImmobiliers",
                column: "ProprietaireId");

            migrationBuilder.CreateIndex(
                name: "IX_Refunds_PaiementId",
                table: "Refunds",
                column: "PaiementId");

            migrationBuilder.CreateIndex(
                name: "IX_Refunds_ReservationId",
                table: "Refunds",
                column: "ReservationId");

            migrationBuilder.AddForeignKey(
                name: "FK_BiensImmobiliers_Proprietaires_ProprietaireId",
                table: "BiensImmobiliers",
                column: "ProprietaireId",
                principalTable: "Proprietaires",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BiensImmobiliers_Proprietaires_ProprietaireId",
                table: "BiensImmobiliers");

            migrationBuilder.DropTable(
                name: "Proprietaires");

            migrationBuilder.DropTable(
                name: "Refunds");

            migrationBuilder.DropIndex(
                name: "IX_BiensImmobiliers_ProprietaireId",
                table: "BiensImmobiliers");

            migrationBuilder.DropColumn(
                name: "ProprietaireId",
                table: "BiensImmobiliers");
        }
    }
}
