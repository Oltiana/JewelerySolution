using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("api/admin/orders")]
public class AdminOrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminOrderController(AppDbContext context)
    {
        _context = context;
    }

    // Merr të gjitha porositë
    [HttpGet]
    public IActionResult GetAllOrders()
    {
        var orders = _context.Orders
            .Include(o => o.Items)
            .ToList();
        return Ok(orders);
    }

    // Konfirmo porosinë
    [HttpPut("{id}/confirm")]
    public IActionResult ConfirmOrder(int id)
    {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();

        order.Status = "Confirmed";
        _context.SaveChanges();
        return Ok(order);
    }

    // Anulo porosinë
    [HttpPut("{id}/cancel")]
    public IActionResult CancelOrder(int id)
    {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();

        order.Status = "Cancelled";
        _context.SaveChanges();
        return Ok(order);
    }
}
