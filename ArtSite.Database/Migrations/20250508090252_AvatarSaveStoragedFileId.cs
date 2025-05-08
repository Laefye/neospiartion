using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtSite.Database.Migrations
{
    /// <inheritdoc />
    public partial class AvatarSaveStoragedFileId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Profiles");
            migrationBuilder.AddColumn<int>(
                name: "Avatar",
                table: "Profiles",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Profiles");
            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "Profiles",
                type: "text",
                nullable: true);
        }
    }
}
