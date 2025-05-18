using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtSite.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddedDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Profiles");
        }
    }
}
