using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JewelerySolution.Data;
using JewelerySolution.Models;
using System.Text.Json;
using System.Diagnostics;

namespace JewelerySolution.Controllers
{
    [ApiController]
    [Route("api/shop")]
    public class ShopController : ControllerBase
    {
        private readonly JeweleryDbContext _context;
        private const string CartSessionKey = "Cart";

        public ShopController(JeweleryDbContext context)
        {
            _context = context;
        }

        // GET: api/shop/cart
        [HttpGet("cart")]
        public IActionResult GetCart()
        {
            var cartJson = HttpContext.Session.GetString(CartSessionKey);
            if (string.IsNullOrEmpty(cartJson))
            {
                return Ok(new List<CartItemDto>());
            }

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var cart = JsonSerializer.Deserialize<List<CartItemDto>>(cartJson, options);
            return Ok(cart ?? new List<CartItemDto>());
        }

        // POST: api/shop/cart
        [HttpPost("cart")]
        public IActionResult AddToCart([FromBody] CartItemDto item)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var cartJson = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartJson)
                ? new List<CartItemDto>()
                : JsonSerializer.Deserialize<List<CartItemDto>>(cartJson, options) ?? new List<CartItemDto>();

            // Kontrollo nëse produkti ekziston tashmë në cart
            var existingItem = cart.FirstOrDefault(x => x.Name == item.Name);
            if (existingItem != null)
            {
                // Update quantity
                existingItem.Qty = item.Qty;
            }
            else
            {
                // Shto produkt të ri
                cart.Add(item);
            }

            // Ruaj cart në session me camelCase
            var updatedCartJson = JsonSerializer.Serialize(cart, options);
            HttpContext.Session.SetString(CartSessionKey, updatedCartJson);

            return Ok(cart);
        }

        // DELETE: api/shop/cart/{name}
        [HttpDelete("cart/{name}")]
        public IActionResult RemoveFromCart(string name)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var cartJson = HttpContext.Session.GetString(CartSessionKey);
            if (string.IsNullOrEmpty(cartJson))
            {
                return Ok(new List<CartItemDto>());
            }

            var cart = JsonSerializer.Deserialize<List<CartItemDto>>(cartJson, options) ?? new List<CartItemDto>();
            cart.RemoveAll(x => x.Name == name);

            var updatedCartJson = JsonSerializer.Serialize(cart, options);
            HttpContext.Session.SetString(CartSessionKey, updatedCartJson);

            return Ok(cart);
        }

        // POST: api/shop/checkout
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest? request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Request është bosh!" });
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                // Përdor cart nga request (frontend dërgon cart në localStorage format me camelCase)
                var cartToUse = request.Cart ?? new List<CartItemDto>();

                if (cartToUse == null || cartToUse.Count == 0)
                {
                    return BadRequest(new { message = "Shporta është bosh!" });
                }

                // Validim për të gjitha cart items
                foreach (var item in cartToUse)
                {
                    if (string.IsNullOrEmpty(item.Name))
                    {
                        return BadRequest(new { message = "Emri i produktit është bosh!" });
                    }
                }

                // Krijoni Order me OrderItems
                var order = new Order
                {
                    CustomerName = request.FullName,
                    Status = "Pending",
                    TotalPrice = request.Total
                };

                // Krijoni OrderItems dhe i shtoni në Order.OrderItems collection
                foreach (var cartItem in cartToUse)
                {
                    order.OrderItems.Add(new OrderItem
                    {
                        ProductName = cartItem.Name,
                        Quantity = cartItem.Qty,
                        Order = order
                    });
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Pastro cart nga session
                HttpContext.Session.Remove(CartSessionKey);

                return Ok(new { message = "Porosia u krijua me sukses!", orderId = order.Id });
            }
            catch (DbUpdateException dbEx)
            {
                // Log error për debugging
                Console.WriteLine($"Checkout DB Error: {dbEx.Message}");
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"InnerException: {dbEx.InnerException.Message}");
                    Console.WriteLine($"InnerException StackTrace: {dbEx.InnerException.StackTrace}");
                }
                var errorMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                return StatusCode(500, new { message = "Gabim gjatë përfundimit të porosisë.", error = errorMessage });
            }
            catch (Exception ex)
            {
                // Log error për debugging
                Console.WriteLine($"Checkout Error: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "Gabim gjatë përfundimit të porosisë.", error = ex.Message });
            }
        }
    }

    // DTOs për Cart
    public class CartItemDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public int Qty { get; set; } = 1;
    }

    // DTO për Checkout Request
    public class CheckoutRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Payment { get; set; } = string.Empty;
        public string DeliveryDate { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public List<CartItemDto> Cart { get; set; } = new();
        public decimal Total { get; set; }
        
        // Fushat për card
        public string CardNumber { get; set; } = string.Empty;
        public string CardExpiry { get; set; } = string.Empty;
        public string CardCVV { get; set; } = string.Empty;
        public string CardHolder { get; set; } = string.Empty;
    }
}
