using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public class EmployeeRepository : Repository<EmployeePersonalInformation>, IEmployeeRepository
    {
        public EmployeeRepository(AppDbContext dbContext) : base(dbContext) { }
        public async Task<List<EmployeeDto>> GetAllActiveAsync() // need to include Employee Status Soon.
        {
            return await _dbContext.EmployeePersonalInformations
                .AsNoTracking()
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    EmployeeId = e.EmployeeId,
                    Name = e.FirstName + e.LastName,
                })
                .ToListAsync();
        }
    }
}
