public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public string FullName { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }

    public string PaymentMethod { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string Comment { get; set; }

    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
