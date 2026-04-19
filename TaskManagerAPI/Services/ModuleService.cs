using Microsoft.EntityFrameworkCore;
using System.Linq;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    

    public class ModuleService : IModuleService
    {
        private readonly AppDbContext _context;
        private readonly IUnitOfWork _unitOfWork;

        public ModuleService(AppDbContext context, IUnitOfWork unitOfWork)
        {
            _context = context;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<Module>> GetAllModulesAsync()
        {
            return await _context.Modules
                .Where(m => !m.IsDeleted)
                .ToListAsync();
        }

        public async Task SyncModulesAsync(List<SyncModuleDto> incomingModules)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var dbModules = await _context.Modules.ToListAsync();

                foreach (var incoming in incomingModules)
                {
                    var existing = dbModules.FirstOrDefault(m => m.Key == incoming.Key);

                    if (existing != null)
                    {
                        // // REPLACED: Update metadata only, preserve the record
                        existing.DisplayName = incoming.DisplayName;
                        existing.Section = incoming.Section;
                        existing.IsDeleted = false;
                    }
                    else
                    {
                        // // ADDED: Only insert if it doesn't exist
                        _context.Modules.Add(new Module
                        {
                            Key = incoming.Key,
                            DisplayName = incoming.DisplayName,
                            Section = incoming.Section,
                            IsDeleted = false
                        });
                    }
                }

                // Optional: Soft-delete modules that are NOT in the incoming frontend config
                var incomingKeys = incomingModules.Select(m => m.Key).ToList();
                var removedModules = dbModules.Where(m => !incomingKeys.Contains(m.Key)).ToList();
                foreach (var removed in removedModules)
                {
                    removed.IsDeleted = true;
                }

                await _unitOfWork.SaveAsync();
                await _unitOfWork.CommitAsync();
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}