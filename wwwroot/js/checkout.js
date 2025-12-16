let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderSummary() {
    const container = document.getElementById("cartSummary");
    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
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

document.getElementById("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Shporta është bosh!");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Ju lutem regjistrohuni ose kyçuni për të vazhduar blerjen.");
        window.location.href = "login.html";
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
        cart: cart
    };

    console.log("Porosia:", order);
    alert("Porosia u përfundua me sukses!");
    localStorage.removeItem("cart");
    window.location.href = "index.html"; // ridrejto tek home pas blerjes
});

renderSummary();