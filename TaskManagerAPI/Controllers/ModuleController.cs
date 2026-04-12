// --- FILE 4: Controllers/ModulesController.cs ---
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
        public async Task<ActionResult<List<ModuleDto>>> GetAll()
            => Ok(await _moduleService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<ModuleDto>> GetById(int id)
        {
            var result = await _moduleService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ModuleDto>> Create(CreateModuleDto dto)
        {
            var result = await _moduleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // ADDED: PUT Endpoint
        [HttpPut("{id}")]
        public async Task<ActionResult<ModuleDto>> Update(int id, UpdateModuleDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch.");

            var result = await _moduleService.UpdateAsync(dto);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _moduleService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}