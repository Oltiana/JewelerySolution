using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateOrder(Order order)
    {
        order.Tax = order.Subtotal * 0.18m;
        order.Total = order.Subtotal + order.Tax;

        // këtu ruhet në databazë (EF Core)
        return Ok(new { message = "Porosia u krye me sukses", order });
    }
}
