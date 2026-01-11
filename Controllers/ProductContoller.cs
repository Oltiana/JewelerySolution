using JewelerySolution.Data;
using JewelerySolution.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JewelerySolution.Controllers
{
    public class ProductController : Controller
    {
        private readonly JeweleryDbContext _context;

        public ProductController(JeweleryDbContext context)
        {
            _context = context;
        }

        // GET: /Products/Category/Earrings
        public async Task<IActionResult> Category(string categoryName)
        {
            if (string.IsNullOrEmpty(categoryName))
            {
                return NotFound();
            }

            // Merr kategorinë dhe produktet e saj nga database
            var category = await _context.Categories
                                         .Include(c => c.Products)
                                         .FirstOrDefaultAsync(c => c.Name == categoryName);

            if (category == null)
            {
                return NotFound();
            }

            return View(category); // kalo objektin Category në View
        }

        // Opsionale: thjesht për URL të shkurtra
        public IActionResult Earrings()
        {
            return RedirectToAction("Category", new { categoryName = "Earrings" });
        }

        public IActionResult Rings()
        {
            return RedirectToAction("Category", new { categoryName = "Rings" });
        }

        public IActionResult Necklaces()
        {
            return RedirectToAction("Category", new { categoryName = "Necklaces" });
        }
    }
}
