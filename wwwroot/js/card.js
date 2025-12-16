let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
    const container = document.getElementById("cartItems");
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
                    <img src="${item.image}" width="70">
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

                <div class="col-2">
                    ${total.toFixed(2)} €
                </div>

                <div class="col-1">
                    <i class="bi bi-trash text-danger" style="cursor:pointer"
                       onclick="removeItem(${index})"></i>
                </div>
            </div>
        </div>`;
    });

    updateTotals(subtotal);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateTotals(subtotal) {
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2) + " €";
    document.getElementById("tax").innerText = tax.toFixed(2) + " €";
    document.getElementById("grandTotal").innerText = total.toFixed(2) + " €";
}

function changeQty(index, value) {
    cart[index].qty += value;
    if (cart[index].qty < 1) cart[index].qty = 1;
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function checkout() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Ju lutem regjistrohuni ose kyçuni për të vazhduar blerjen.");
        window.location.href = "login.html";
        return;
    }

    if (cart.length === 0) {
        alert("Shporta është bosh.");
        return;
    }

    window.location.href = "checkout.html";
}

renderCart();
