// --- FILE 1: DTOs/ModuleDtos.cs ---
namespace TaskManagerAPI.DTOs
{
    public class SyncModuleDto
    {
        public string Key { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Section { get; set; } = null!;
    }
}