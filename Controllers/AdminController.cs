using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JewelerySolution.Data;
using JewelerySolution.Models;

namespace JewelerySolution.Controllers
{
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
                // Optimizim: Përdorim AsNoTracking dhe limit për performancë më të mirë
                var orderDtos = await _context.Orders
                    .AsNoTracking() // Shmang tracking-in për performancë më të mirë
                    .Include(o => o.OrderItems)
                    .OrderByDescending(o => o.Id)
                    .Take(100) // Limit në 100 porosi për performancë
                    .Select(o => new OrderDto
                    {
                        Id = o.Id,
                        CustomerName = o.CustomerName ?? string.Empty,
                        Status = o.Status ?? "Pending",
                        TotalPrice = o.TotalPrice,
                        OrderItems = o.OrderItems != null 
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
                // Në rast gabimi, kthe një listë bosh
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