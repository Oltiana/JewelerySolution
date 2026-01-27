using JewelerySolution.Data;
using JewelerySolution.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JewelerySolution.Controllers
{
    [AllowAnonymous]
    public class AdminController : Controller
    {
        private readonly JeweleryDbContext _context;

        public AdminController(JeweleryDbContext context)
        {
            _context = context;
        }

        // GET: Admin
        public async Task<IActionResult> Index()
        {
            try
            {
                // Optimizoj query-në duke përdorur projection direkt dhe duke kufizuar numrin e porosive
                var orderDtos = await _context.Orders
                    .AsNoTracking()
                    .OrderByDescending(o => o.Id)
                    .Take(50) // Zvogëloj nga 100 në 50 për performancë më të mirë
                    .Select(o => new OrderDto
                    {
                        Id = o.Id,
                        CustomerName = o.CustomerName ?? string.Empty,
                        Status = o.Status ?? "Pending",
                        TotalPrice = o.TotalPrice,
                        OrderItems = o.OrderItems != null && o.OrderItems.Any()
                            ? o.OrderItems.Select(oi => new OrderItemDto
                            {
                                ProductName = oi.ProductName ?? string.Empty,
                                Quantity = oi.Quantity
                            }).ToList()
                            : new List<OrderItemDto>()
                    })
                    .ToListAsync();

                return View(orderDtos);
            }
            catch (Exception ex)
            {
                // Log error dhe kthe listë bosh
                // Në production, përdor ILogger për logging
                System.Diagnostics.Debug.WriteLine($"Error loading orders: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
                return View(new List<OrderDto>());
            }
        }

        // POST: Admin/Cancel/5
        [HttpPost]
        public async Task<IActionResult> Cancel(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/Ship/5
        [HttpPost]
        public async Task<IActionResult> Ship(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = "Shipped";
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Test()
        {
            var count = _context.Products.Count();
            return Content(count.ToString());
        }

    }
}