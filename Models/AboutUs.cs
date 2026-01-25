using System;

namespace JewerlySolutions.Models
{
	public class AboutUs
	{
		public int Id { get; set; }

		public string Title { get; set; } = null!;

		public string? IntroText { get; set; }

		public string? Story { get; set; }

		public string? Mission { get; set; }

		public string? Vision { get; set; }

		public string? HeroImageUrl { get; set; }

		public DateTime UpdatedAt { get; set; }
	}
}
