using JewelerySolution.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;


namespace JewelerySolution.Models
{
    public class Product
    {
        public int Id { get; set; }

        public required string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public required string ImageUrl { get; set; }

        [NotMapped] // ⭐ shumë e rëndësishme
        public IFormFile? ImageFile { get; set; }

        public int CategoryId { get; set; }
        public required Category Category { get; set; }
    }
}
