// --- FILE 2: Services/IModuleService.cs ---
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public interface IModuleService
    {
        Task<List<Module>> GetAllModulesAsync();
        Task SyncModulesAsync(List<SyncModuleDto> incomingModules);
    }
}