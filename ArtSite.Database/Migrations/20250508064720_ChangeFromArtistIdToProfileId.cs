using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtSite.Database.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFromArtistIdToProfileId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ArtistId",
                table: "Tiers",
                newName: "ProfileId");

            migrationBuilder.RenameColumn(
                name: "ArtistId",
                table: "Arts",
                newName: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfileId",
                table: "Tiers",
                newName: "ArtistId");

            migrationBuilder.RenameColumn(
                name: "ProfileId",
                table: "Arts",
                newName: "ArtistId");
        }
    }
}
