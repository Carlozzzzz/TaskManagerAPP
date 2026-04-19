using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ModulesController : BaseController
    {
        private readonly IModuleService _moduleService;

        public ModulesController(IModuleService moduleService)
            => _moduleService = moduleService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _moduleService.GetAllModulesAsync());
        }

        [HttpPost("sync")]
        public async Task<IActionResult> Sync([FromBody] List<SyncModuleDto> modules)
        {
            if (modules == null || !modules.Any())
                return BadRequest("Module list cannot be empty.");

            await _moduleService.SyncModulesAsync(modules);
            return Ok(new { message = "Modules synchronized successfully." });
        }
    }
}