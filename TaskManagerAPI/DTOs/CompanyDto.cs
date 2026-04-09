using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.DTOs
{
	// What we SEND to the frontend (response)
	public class CompanyDto
	{
		public int Id { get; set; }
		public string Description { get; set; } = string.Empty;
		public bool IsActive { get; set; }
	}

	public class CreateCompanyDto
	{
		[Required]
		[StringLength(50, MinimumLength = 3)]
		public string Description { get; set; } = string.Empty;

		[Required]
		public bool IsActive { get; set; }
	}

	public class UpdateCompanyDto
	{
		public int Id { get; set; }
		
		[Required]
		[StringLength(50, MinimumLength = 3)]
		public string Description { get; set; } = string.Empty;

		[Required]
		public bool IsActive { get; set; }
	}

}