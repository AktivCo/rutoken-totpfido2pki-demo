using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RutokenTotpFido2Demo.Migrations
{
    /// <inheritdoc />
    public partial class AddFidoFactorType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined");

            migrationBuilder.AlterColumn<int>(
                name: "TotpKeyId",
                table: "TotpTimeStepLogined",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "FactorType",
                table: "FidoKeys",
                type: "text",
                nullable: false,
                defaultValue: "MFA");

            migrationBuilder.AddForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined",
                column: "TotpKeyId",
                principalTable: "TotpKeys",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined");

            migrationBuilder.DropColumn(
                name: "FactorType",
                table: "FidoKeys");

            migrationBuilder.AlterColumn<int>(
                name: "TotpKeyId",
                table: "TotpTimeStepLogined",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TotpTimeStepLogined_TotpKeys_TotpKeyId",
                table: "TotpTimeStepLogined",
                column: "TotpKeyId",
                principalTable: "TotpKeys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
