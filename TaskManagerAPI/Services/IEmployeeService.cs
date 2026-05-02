using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Services
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAll();
        Task<EmployeeDetailsDto?> GetById(int id);
        Task<EmployeeDto> Create(CreateEmployeeDto dto);
        Task<EmployeeDto?> Update(UpdateEmployeeDto dto);
        Task<bool> Delete(int id);

        Task<List<EmployeeDto>> GetAllActiveAsync();
    }
}
