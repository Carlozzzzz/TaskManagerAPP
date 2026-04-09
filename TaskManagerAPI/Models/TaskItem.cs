using TaskManagerAPI.Models.Base;

namespace TaskManagerAPI.Models
{
    public class TaskItem : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "todo";
        public DateTime DueDate { get; set; }
        
        // REMOVED: CreatedAt and UserId (Now handled by BaseEntity/DbContext)
    }
}