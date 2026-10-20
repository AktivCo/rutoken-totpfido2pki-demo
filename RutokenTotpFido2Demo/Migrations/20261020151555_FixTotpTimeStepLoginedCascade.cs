using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RutokenTotpFido2Demo.Migrations
{
    /// <inheritdoc />
    public partial class FixTotpTimeStepLoginedCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined");

            migrationBuilder.AddForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined",
                column: "TotpKeyId",
                principalTable: "TotpKeys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined");

            migrationBuilder.AddForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined",
                column: "TotpKeyId",
                principalTable: "TotpKeys",
                principalColumn: "Id");
        }
    }
}
