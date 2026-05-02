using TaskManagerAPI.Models.Base;

namespace TaskManagerAPI.Models
{
    public class EmployeeInformation : BaseSoftDeleteEntity
    {
        public int Id { get; set; }
        public int EmployeePersonalInformationId { get; set; }
        public int CompanyId { get; set; }
        // etc...
    }
}
