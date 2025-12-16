using Microsoft.EntityFrameworkCore;
using JewelerySolution.Models;
using System.Collections.Generic;

namespace JewelerySolution.Data
{
    public class JeweleryDbContext : DbContext
    {
        public JeweleryDbContext(DbContextOptions<JeweleryDbContext> options)
            : base(options)
        { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
