-- KY SCRIPT KONTROLLON POROSITË NË DATABAZË
-- Ekzekutoni këtë në SSMS për të kontrolluar porositë

-- Kontrollo porositë
SELECT * FROM Orders ORDER BY Id DESC;

-- Kontrollo OrderItems
SELECT * FROM OrderItem ORDER BY Id DESC;

-- Kontrollo porositë me OrderItems (JOIN)
SELECT 
    o.Id AS OrderId,
    o.CustomerName,
    o.Status,
    o.TotalPrice,
    oi.Id AS OrderItemId,
    oi.ProductName,
    oi.Quantity
FROM Orders o
LEFT JOIN OrderItem oi ON o.Id = oi.OrderId
ORDER BY o.Id DESC, oi.Id DESC;
