using JewelerySolution.Models;
using JewerlySolution.Models;
using JewerlySolution.Models;
using JewerlySolutions.Models;
using Microsoft.EntityFrameworkCore;

namespace JewerlySolution.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options)
			: base(options)
		{
		}

		public DbSet<Product> Products { get; set; }
		public DbSet<AboutUs> AboutUs { get; set; }
		public DbSet<AboutValue> AboutValues { get; set; }
	}
}
