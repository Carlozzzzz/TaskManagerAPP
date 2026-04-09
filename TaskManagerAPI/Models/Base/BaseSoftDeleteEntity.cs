using TaskManagerAPI.Models.Interfaces;

namespace TaskManagerAPI.Models.Base
{
    public abstract class BaseSoftDeleteEntity : BaseEntity, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public int? DeletedBy { get; set; }
    }
}