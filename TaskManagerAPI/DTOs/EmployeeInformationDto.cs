namespace TaskManagerAPI.DTOs
{
    public class EmployeeInformationDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int CompanyId { get; set; }    
        public string CompanyName { get; set; } = string.Empty;
    }
}
