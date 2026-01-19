using JewelerySolution.Data;
using JewelerySolution.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JewelerySolution.Controllers
{

    public class AdminProductController : Controller
    {
        private readonly JeweleryDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminProductController(JeweleryDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.Category)
                .ToList();

            return View(products);
        }



        // ================= CREATE =================
        public IActionResult Create()
        {
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product product)
        {
            if (product.ImageFile == null)
            {
                ModelState.AddModelError("ImageFile", "Image is required");
                ViewBag.Categories = _context.Categories.ToList();
                return View(product);
            }

            string fileName = Guid.NewGuid() + Path.GetExtension(product.ImageFile.FileName);
            string path = Path.Combine(_env.WebRootPath, "images", fileName);

            using var stream = new FileStream(path, FileMode.Create);
            product.ImageFile.CopyTo(stream);

            product.ImageUrl = "/images/" + fileName; // ⭐ shumë e rëndësishme

            _context.Products.Add(product);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }


        // ================= EDIT =================
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            ViewBag.Categories = _context.Categories.ToList();
            return View(product);
        }

        [HttpPost]
        public IActionResult Edit(Product product)
        {
            var existingProduct = _context.Products
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == product.Id);

            if (existingProduct == null) return NotFound();

            if (product.ImageFile != null)
            {
                // fshi foton e vjetër
                if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, existingProduct.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                string fileName = Guid.NewGuid() + Path.GetExtension(product.ImageFile.FileName);
                string path = Path.Combine(_env.WebRootPath, "images", fileName);

                using var stream = new FileStream(path, FileMode.Create);
                product.ImageFile.CopyTo(stream);

                product.ImageUrl = "/images/" + fileName;
            }
            else
            {
                product.ImageUrl = existingProduct.ImageUrl;
            }

            _context.Products.Update(product);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }


        // ================= DELETE =================
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Include(p => p.Category)
                                           .FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            return View(product);
        }

        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                var path = Path.Combine(_env.WebRootPath, product.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

    }
}
