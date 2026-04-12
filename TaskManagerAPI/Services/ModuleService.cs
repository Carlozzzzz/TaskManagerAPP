// --- FILE 3: Services/ModuleService.cs ---
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class ModuleService : IModuleService
    {
        private readonly IRepository<Module> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public ModuleService(IRepository<Module> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<ModuleDto>> GetAllAsync()
        {
            var modules = await _repository.GetAllAsync();
            return modules.Select(MapToDto).ToList();
        }

        public async Task<ModuleDto?> GetByIdAsync(int id)
        {
            var m = await _repository.GetByIdAsync(id);
            return m == null ? null : MapToDto(m);
        }

        public async Task<ModuleDto> CreateAsync(CreateModuleDto dto)
        {
            var entity = new Module
            {
                Key = dto.Key,
                DisplayName = dto.DisplayName,
                Section = dto.Section
            };

            await _repository.AddAsync(entity);
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        // ADDED: Update Implementation
        public async Task<ModuleDto?> UpdateAsync(UpdateModuleDto dto)
        {
            var m = await _repository.GetByIdAsync(dto.Id);
            if (m == null) return null;

            // Update tracked entity properties
            m.Key = dto.Key;
            m.DisplayName = dto.DisplayName;
            m.Section = dto.Section;

            await _unitOfWork.SaveAsync(); // Triggers Audit & Persistence
            return MapToDto(m);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var m = await _repository.GetByIdAsync(id);
            if (m == null) return false;

            m.IsDeleted = true;
            await _unitOfWork.SaveAsync();
            return true;
        }

        // Clean mapping helper
        private ModuleDto MapToDto(Module m) => new ModuleDto
        {
            Id = m.Id,
            Key = m.Key,
            DisplayName = m.DisplayName,
            Section = m.Section
        };
    }
}