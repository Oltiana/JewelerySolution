

async function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    // Merr cart nga backend
    const res = await fetch("https://localhost:5001/api/cart");
    const cart = await res.json();

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning text-center">
                Shporta është bosh
            </div>`;
        updateTotals(0);
        updateCartCount(cart);
        return;
    }

    let subtotal = 0;

    cart.forEach((item) => {
        const total = item.product.price * item.quantity;
        subtotal += total;

        container.innerHTML += `
        <div class="card p-3 mb-3">
            <div class="row align-items-center">
                <div class="col-6 d-flex gap-3">
                    <img src="${item.product.image}" width="70">
                    <div>
                        <b>${item.product.name}</b><br>
                        <small>${item.product.price.toFixed(2)} €</small>
                    </div>
                </div>

                <div class="col-3 d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="changeQty(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="changeQty(${item.id}, ${item.quantity + 1})">+</button>
                </div>

                <div class="col-2 fw-bold">
                    ${total.toFixed(2)} €
                </div>

                <div class="col-1">
                    <i class="bi bi-trash text-danger"
                       style="cursor:pointer"
                       onclick="removeItem(${item.id})"></i>
                </div>
            </div>
        </div>`;
    });

    updateTotals(subtotal);
    updateCartCount(cart);
}

// Update cart badge
function updateCartCount(cart) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cartCount");
    if (badge) {
        badge.innerText = totalQty;
        badge.style.display = totalQty > 0 ? "inline-block" : "none";
    }
}

// Add product to cart
function addToCart(productId) {
    fetch(`https://localhost:5001/api/cart/add?productId=${productId}`, {
        method: "POST"
    }).then(() => renderCart());
}

// Change quantity
function changeQty(id, qty) {
    if (qty < 1) qty = 1;
    fetch(`https://localhost:5001/api/cart/qty?id=${id}&qty=${qty}`, {
        method: "PUT"
    }).then(() => renderCart());
}

// Remove item
function removeItem(id) {
    fetch(`https://localhost:5001/api/cart/${id}`, {
        method: "DELETE"
    }).then(() => renderCart());
}

// Checkout
function checkout() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Ju lutem kyçuni për të vazhduar.");
        window.location.href = "login.html";
        return;
    }

    window.location.href = "checkout.html";
}

// Update totals
function updateTotals(subtotal) {
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2) + " €";
    document.getElementById("tax").innerText = tax.toFixed(2) + " €";
    document.getElementById("grandTotal").innerText = total.toFixed(2) + " €";
}

// On load
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});
