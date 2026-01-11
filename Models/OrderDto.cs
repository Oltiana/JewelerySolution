namespace JewelerySolution.Models
{
    public class Order
    {
        public int Id { get; set; }
        public required string CustomerName { get; set; }
        public required string Status { get; set; }
        public decimal TotalPrice { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public required string ProductName { get; set; }
        public int Quantity { get; set; }

        public int OrderId { get; set; }
        public required Order Order { get; set; }
    }
}

namespace JewelerySolution.Models
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}

