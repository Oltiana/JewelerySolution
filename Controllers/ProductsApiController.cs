using JewelerySolution.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JewelerySolution.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsApiController : ControllerBase
    {
        private readonly JeweleryDbContext _context;

        public ProductsApiController(JeweleryDbContext context)
        {
            _context = context;
        }

        // GET: /api/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    Category = p.Category.Name
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: /api/products/category/Earrings
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetByCategory(string category)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Category.Name == category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    Category = p.Category.Name
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}
