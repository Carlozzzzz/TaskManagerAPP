using TaskManagerAPI.Models.Base;

namespace TaskManagerAPI.Models
{
    public class Company : BaseSoftDeleteEntity
    {
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}