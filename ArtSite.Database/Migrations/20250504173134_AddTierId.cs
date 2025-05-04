using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtSite.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTierId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TierId",
                table: "Arts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pictures_ArtId",
                table: "Pictures",
                column: "ArtId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pictures_Arts_ArtId",
                table: "Pictures",
                column: "ArtId",
                principalTable: "Arts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pictures_Arts_ArtId",
                table: "Pictures");

            migrationBuilder.DropIndex(
                name: "IX_Pictures_ArtId",
                table: "Pictures");

            migrationBuilder.DropColumn(
                name: "TierId",
                table: "Arts");
        }
    }
}
