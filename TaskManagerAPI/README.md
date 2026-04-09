dotnet ef migrations add InitialCreate
dotnet ef database update

dotnet ef migrations remove

-----------------------
Migration Files
	Add-Migration Remove_IdUserRole_Model -Context AppDbContext
	Add-Migration Create_Company_Model -Context AppDbContext