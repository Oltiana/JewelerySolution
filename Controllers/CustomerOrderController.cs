using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("api/customer/orders")]
public class CustomerOrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerOrderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult CreateOrder(Order order)
    {
        order.Tax = order.Subtotal * 0.18m;
        order.Total = order.Subtotal + order.Tax;
        order.Status = "Pending";

        _context.Orders.Add(order);
        _context.SaveChanges();

        return Ok(new { message = "Porosia u krye me sukses", order });
    }

    [HttpGet("{customerEmail}")]
    public IActionResult GetCustomerOrders(string customerEmail)
    {
        var orders = _context.Orders
            .Include(o => o.Items)
            .Where(o => o.CustomerEmail == customerEmail)
            .ToList();

        return Ok(orders);
    }
}
