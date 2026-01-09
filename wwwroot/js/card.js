// =======================
// CART GLOBAL
// =======================
let cart = []; // marrim nga backend në loadCart()

// =======================
// BACKEND FUNCTIONS
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
    renderCart();
}

async function addToCart(item) {
    await fetch("https://localhost:7075/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    });
    await loadCart();
}

async function removeItem(index) {
    const name = cart[index].name;
    await fetch(`https://localhost:7075/api/shop/cart/${encodeURIComponent(name)}`, {
        method: "DELETE"
    });
    await loadCart();
}

// =======================
// RENDER CART
// =======================
function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning text-center">
                Shporta është bosh
            </div>
        `;
        updateTotals(0);
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        item.qty = item.qty || 1;
        const total = item.price * item.qty;
        subtotal += total;

        container.innerHTML += `
            <div class="card p-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-6 d-flex gap-3">
                        <img src="${item.image}" width="70" height="70" style="object-fit:cover">
                        <div>
                            <b>${item.name}</b><br>
                            <small>${item.price.toFixed(2)} €</small>
                        </div>
                    </div>

                    <div class="col-3 d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${index}, 1)">+</button>
                    </div>

                    <div class="col-2 fw-bold">
                        ${total.toFixed(2)} € 
                    </div>

                    <div class="col-1 text-end">
                        <i class="bi bi-trash text-danger" style="cursor:pointer"
                           onclick="removeItem(${index})"></i>
                    </div>
                </div>
            </div>
        `;
    });

    updateTotals(subtotal);
}

// =======================
// TOTALS
// =======================
function updateTotals(subtotal) {
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2) + " €";
    document.getElementById("tax").innerText = tax.toFixed(2) + " €";
    document.getElementById("grandTotal").innerText = total.toFixed(2) + " €";
}

// =======================
// CHANGE QTY
// =======================
async function changeQty(index, value) {
    cart[index].qty += value;
    if (cart[index].qty < 1) cart[index].qty = 1;

    await fetch("https://localhost:5001/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart[index])
    });

    renderCart();
}

// =======================
// CHECKOUT
// =======================
window.checkout = function () {
    window.location.href = "checkout.html";
};

// =======================
// ON LOAD
// =======================
document.addEventListener("DOMContentLoaded", loadCart);

console.log("card.js loaded");
