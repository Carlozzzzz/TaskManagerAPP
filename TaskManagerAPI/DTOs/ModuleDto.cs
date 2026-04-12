// --- FILE 1: DTOs/ModuleDtos.cs ---
namespace TaskManagerAPI.DTOs
{
    public class ModuleDto
    {
        public int Id { get; set; }
        public string Key { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Section { get; set; } = null!;
    }

    public class CreateModuleDto
    {
        public string Key { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Section { get; set; } = null!;
    }

    // ADDED: Update DTO
    public class UpdateModuleDto
    {
        public int Id { get; set; }
        public string Key { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Section { get; set; } = null!;
    }
}