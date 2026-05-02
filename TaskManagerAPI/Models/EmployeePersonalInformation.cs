using TaskManagerAPI.Models.Base;

namespace TaskManagerAPI.Models
{
    public class EmployeePersonalInformation : BaseSoftDeleteEntity
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string MiddleName { get; set; } = string.Empty;
        public string Suffix { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
