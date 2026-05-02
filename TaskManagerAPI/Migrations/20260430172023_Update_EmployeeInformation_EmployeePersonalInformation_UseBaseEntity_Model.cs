using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagerAPI.Migrations
{
    /// <inheritdoc />
    public partial class Update_EmployeeInformation_EmployeePersonalInformation_UseBaseEntity_Model : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EmployeePersonalInformations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "EmployeePersonalInformations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "EmployeePersonalInformations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "EmployeePersonalInformations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "EmployeePersonalInformations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EmployeePersonalInformations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "EmployeePersonalInformations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EmployeeInformations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "EmployeeInformations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "EmployeeInformations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "EmployeeInformations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "EmployeeInformations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EmployeeInformations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "EmployeeInformations",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "EmployeePersonalInformations");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EmployeeInformations");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EmployeeInformations");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "EmployeeInformations");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "EmployeeInformations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "EmployeeInformations");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EmployeeInformations");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "EmployeeInformations");
        }
    }
}
