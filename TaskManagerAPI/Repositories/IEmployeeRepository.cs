using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public interface IEmployeeRepository : IRepository<EmployeePersonalInformation>
    {
        Task<List<EmployeeDto>> GetAllActiveAsync();
    }
}
