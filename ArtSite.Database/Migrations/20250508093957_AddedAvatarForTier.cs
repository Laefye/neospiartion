using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtSite.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddedAvatarForTier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Avatar",
                table: "Tiers",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Tiers");
        }
    }
}
