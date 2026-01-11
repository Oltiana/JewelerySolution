// =======================
// CART GLOBAL
// =======================
let cart = []; // marrim nga localStorage

// =======================
// LOAD CART FROM LOCALSTORAGE
// =======================
function loadCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    renderCart();
}

function addToCart(item) {
    const index = cart.findIndex(x => x.name === item.name);
    if (index > -1) {
        cart[index].qty += 1;
    } else {
        cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
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
        // Përdor property names nga localStorage
        const itemName = item.name || '';
        const itemPrice = item.price || 0;
        const itemImage = item.image || '';
        const itemQty = item.qty || 1;
        
        const total = itemPrice * itemQty;
        subtotal += total;

        container.innerHTML += `
            <div class="card p-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-6 d-flex gap-3">
                        <img src="${itemImage}" width="70" height="70" style="object-fit:cover">
                        <div>
                            <b>${itemName}</b><br>
                            <small>${itemPrice.toFixed(2)} €</small>
                        </div>
                    </div>

                    <div class="col-3 d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${index}, -1)">-</button>
                        <span>${itemQty}</span>
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
function changeQty(index, value) {
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        const currentQty = item.qty || 1;
        const newQty = currentQty + value;
        
        if (newQty < 1) {
            alert("Sasia nuk mund të jetë më pak se 1");
            return;
        }

        item.qty = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
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
