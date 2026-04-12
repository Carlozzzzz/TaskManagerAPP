// --- FILE 2: Services/IModuleService.cs ---
using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Services
{
    public interface IModuleService
    {
        Task<List<ModuleDto>> GetAllAsync();
        Task<ModuleDto?> GetByIdAsync(int id);
        Task<ModuleDto> CreateAsync(CreateModuleDto dto);
        Task<ModuleDto?> UpdateAsync(UpdateModuleDto dto); // ADDED
        Task<bool> DeleteAsync(int id);
    }
}