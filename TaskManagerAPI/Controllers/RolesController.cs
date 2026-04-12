// --- FILE 6: Controllers/RolesController.cs ---
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RolesController : BaseController
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
            => _roleService = roleService;

        [HttpGet]
        public async Task<ActionResult<List<RoleWithPermissionsDto>>> GetAll()
            => Ok(await _roleService.GetAllRolesAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleWithPermissionsDto>> GetById(int id)
        {
            var role = await _roleService.GetRoleByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult<RoleWithPermissionsDto>> Create(CreateRoleDto dto)
        {
            var result = await _roleService.CreateRoleAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _roleService.DeleteRoleAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}