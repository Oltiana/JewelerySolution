// =======================
// CART GLOBAL
// =======================
let cart = []; // marrim nga backend

// =======================
// LOAD CART FROM BACKEND
// =======================
async function loadCart() {
    try {
        const res = await fetch("https://localhost:7075/api/shop/cart");
        if (!res.ok) throw new Error("Gabim me backend cart");
        cart = await res.json();
    } catch (err) {
        console.error("Gabim me backend, përdor localStorage si fallback", err);
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    }
    renderSummary();
}

// =======================
// RENDER SUMMARY
// =======================
function renderSummary() {
    const container = document.getElementById("cartSummary");
    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        item.qty = item.qty || 1;
        const total = item.price * item.qty;
        subtotal += total;

        container.innerHTML += `
            <div class="d-flex justify-content-between">
                <span>${item.name} x ${item.qty}</span>
                <span>${total.toFixed(2)} €</span>
            </div>
        `;
    });

    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2) + " €";
    document.getElementById("tax").innerText = tax.toFixed(2) + " €";
    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2) + " €";
}

// =======================
// SUBMIT ORDER
// =======================
document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Shporta është bosh!");
        return;
    }

    // Merr vlerat nga forma
    const order = {
        fullName: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postalCode").value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        deliveryDate: document.getElementById("deliveryDate").value,
        comment: document.getElementById("comment").value,
        cart: cart,
        total: parseFloat(document.getElementById("grandTotal").innerText)
    };

    try {
        const res = await fetch("https://localhost:7075/api/shop/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        const data = await res.json();
        alert(data.message);

        // pastro cart lokalisht dhe ridrejto
        cart = [];
        localStorage.removeItem("cart");
        window.location.href = "index.html";
    } catch (err) {
        console.error("Gabim me backend gjatë checkout", err);
        alert("Gabim gjatë përfundimit të porosisë.");
    }
});

// =======================
// ON LOAD
// =======================
document.addEventListener("DOMContentLoaded", loadCart);

console.log("checkout.js loaded");
