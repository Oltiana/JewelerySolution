using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private static List<CartItem> Cart = new();

    [HttpGet("{userId}")]
    public IActionResult GetCart(int userId)
    {
        return Ok(Cart);
    }

    [HttpPost("add")]
    public IActionResult AddToCart(CartItem item)
    {
        var existing = Cart.FirstOrDefault(x => x.ProductId == item.ProductId);
        if (existing != null)
            existing.Quantity += item.Quantity;
        else
            Cart.Add(item);

        return Ok(Cart);
    }

    [HttpDelete("{productId}")]
    public IActionResult Remove(int productId)
    {
        Cart.RemoveAll(x => x.ProductId == productId);
        return Ok(Cart);
    }
}
