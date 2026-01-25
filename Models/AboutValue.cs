namespace JewerlySolution.Models
{
	public class AboutValue
	{
		public int Id { get; set; }

		public string Title { get; set; } = null!;

		public string Description { get; set; } = null!;

		public string? Icon { get; set; }

		public int SortOrder { get; set; }

		public bool IsActive { get; set; }
	}
}
