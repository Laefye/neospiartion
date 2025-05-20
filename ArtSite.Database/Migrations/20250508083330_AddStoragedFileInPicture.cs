using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtSite.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddStoragedFileInPicture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "Pictures");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Pictures");

            migrationBuilder.AddColumn<int>(
                name: "StoragedFileId",
                table: "Pictures",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StoragedFileId",
                table: "Pictures");

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "Pictures",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Pictures",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
