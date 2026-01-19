using JewelerySolution.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace JewelerySolution.Controllers
{
    
        [ApiController]
        [Route("api/products")]
        public class ProductApiController : ControllerBase
        {
            private readonly JeweleryDbContext _context;

            public ProductApiController(JeweleryDbContext context)
            {
                _context = context;
            }

            [HttpGet]
            public IActionResult GetProducts()
            {
                var products = _context.Products
                    .Include(p => p.Category)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Stock,
                        ImageUrl = "/images/" + p.ImageUrl,
                        Category = p.Category.Name
                    })
                    .ToList();

                return Ok(products);
            }
        }

    }

