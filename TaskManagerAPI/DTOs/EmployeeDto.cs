namespace TaskManagerAPI.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public required string Name { get; set; }
    }

    public class EmployeeDetailsDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string MiddleName { get; set; } = string.Empty;
        public string Suffix { get; set; } = string.Empty;
    }

    public class CreateEmployeeDto
    {
        public string EmployeeId { get; set; } = string.Empty; // I think I need an generator | manual input for this
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string MiddleName { get; set; } = string.Empty;
        public string Suffix { get; set; } = string.Empty;
    }

    public class UpdateEmployeeDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty; // I think I need an generator | manual input for this
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string MiddleName { get; set; } = string.Empty;
        public string Suffix { get; set; } = string.Empty;
    }
}
