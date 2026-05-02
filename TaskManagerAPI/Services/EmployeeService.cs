using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace TaskManagerAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repository;  // MODIFIED: specific repo
        private readonly IUnitOfWork _unitOfWork;  // ADDED: owns all saves

        public EmployeeService(
            IEmployeeRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }
        

        public async Task<List<EmployeeDto>> GetAll()
        {
            var employees = await _repository.GetAllAsync();

            return employees.Select(e => new EmployeeDto
            {
                Id = e.Id,
                EmployeeId = e.EmployeeId,
                Name = e.FirstName + " " + e.LastName,
            }).ToList();
        }

        public Task<List<EmployeeDto>> GetAllActiveAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<EmployeeDetailsDto?> GetById(int id)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null) return null;

            return new EmployeeDetailsDto
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                FirstName = employee.FirstName,
                MiddleName = employee.MiddleName,
                LastName = employee.LastName,
                Suffix = employee.Suffix,
            };
        }

        public async Task<EmployeeDto> Create(CreateEmployeeDto dto)
        {
            var entity = new EmployeePersonalInformation
            {
                EmployeeId = dto.EmployeeId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MiddleName = dto.MiddleName,
                Suffix = dto.Suffix,
            };

            await _repository.AddAsync(entity);
            await _unitOfWork.SaveAsync(); // MODIFIED: UnitOfWork commits

            return new EmployeeDto
            {
                Id = entity.Id,
                EmployeeId = dto.EmployeeId,
                Name = entity.FirstName + " " + entity.LastName,
            };
        }

        public async Task<EmployeeDto?> Update(UpdateEmployeeDto dto)
        {
            var employee = await _repository.GetByIdAsync(dto.Id);
            if (employee == null) return null;

            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.MiddleName = dto.MiddleName;
            employee.Suffix = dto.Suffix;

            await _unitOfWork.SaveAsync();

            return new EmployeeDto
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                Name = employee.FirstName + "" + employee.LastName,
            };
        }

        public async Task<bool> Delete(int id)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null) return false;

            // Soft delete — flip the bit
            // AppDbContext sees IsDeleted = true → sets DeletedAt + DeletedBy
            employee.IsDeleted = true;

            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
