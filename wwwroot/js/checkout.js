// =======================
// CART GLOBAL
// =======================
let cart = []; // marrim nga localStorage

// =======================
// LOAD CART FROM LOCALSTORAGE
// =======================
function loadCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart loaded:", cart);
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
        // Përdor property names nga localStorage
        const itemName = item.name || '';
        const itemPrice = item.price || 0;
        const itemQty = item.qty || 1;
        
        const total = itemPrice * itemQty;
        subtotal += total;

        container.innerHTML += `
            <div class="d-flex justify-content-between">
                <span>${itemName} x ${itemQty}</span>
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

    // Validim për metodën e pagesës
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || '';
    
    if (paymentMethod === "Card") {
        const cardNumber = document.getElementById("cardNumber")?.value.trim() || '';
        const cardExpiry = document.getElementById("cardExpiry")?.value.trim() || '';
        const cardCVV = document.getElementById("cardCVV")?.value.trim() || '';
        const cardHolder = document.getElementById("cardHolder")?.value.trim() || '';
        
        if (!cardNumber || !cardExpiry || !cardCVV || !cardHolder) {
            alert("Ju lutem plotësoni të gjitha fushat për pagesë me kartë!");
            return;
        }
    }

    // Merr vlerat nga forma
    const grandTotalText = document.getElementById("grandTotal").innerText;
    const totalValue = parseFloat(grandTotalText.replace(' €', '').replace(',', '.')) || 0;
    
    // Backend pranon camelCase për shkak të JsonNamingPolicy.CamelCase
    const cartForBackend = cart.map(item => ({
        name: item.name || '',
        price: item.price || 0,
        image: item.image || '',
        qty: item.qty || 1
    }));
    
    const order = {
        fullName: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postalCode").value,
        payment: paymentMethod,
        deliveryDate: document.getElementById("deliveryDate").value,
        comment: document.getElementById("comment").value || '',
        cart: cartForBackend,
        total: totalValue,
        // Fushat për card
        cardNumber: document.getElementById("cardNumber")?.value || '',
        cardExpiry: document.getElementById("cardExpiry")?.value || '',
        cardCVV: document.getElementById("cardCVV")?.value || '',
        cardHolder: document.getElementById("cardHolder")?.value || ''
    };

    console.log("Submitting order:", order);
    console.log("Cart for backend:", cartForBackend);

    try {
        const res = await fetch("https://localhost:7075/api/shop/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (!res.ok) {
            let errorData;
            try {
                errorData = await res.json();
            } catch (e) {
                errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
            }
            const errorMessage = errorData.error || errorData.message || "Gabim gjatë checkout";
            console.error("Backend error:", errorData);
            throw new Error(errorMessage);
        }

        const data = await res.json();
        const orderId = data.orderId || '';

        // pastro cart lokalisht dhe ridrejto në faqen e konfirmimit
        cart = [];
        localStorage.removeItem("cart");
        
        // Ridrejto në faqen e konfirmimit me orderId
        window.location.href = `OrderConfirmationn.html?orderId=${orderId}`;
    } catch (err) {
        console.error("Gabim me backend gjatë checkout", err);
        let errorMessage = "Gabim gjatë përfundimit të porosisë.";
        if (err.message) {
            errorMessage = err.message;
        }
        alert(errorMessage);
    }
});

// =======================
// PAYMENT METHOD CHANGE HANDLER
// =======================
function setupPaymentHandlers() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardFields = document.getElementById("cardFields");
    
    paymentRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            // Fshiho fushat e card-it
            if (cardFields) {
                cardFields.style.display = "none";
                // Heq required nga fushat
                const cardInputs = cardFields.querySelectorAll('input');
                cardInputs.forEach(input => input.removeAttribute('required'));
            }
            
            // Shfaq fushat e card-it nëse zgjidhet Card
            if (this.value === "Card" && cardFields) {
                cardFields.style.display = "block";
                cardFields.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
            }
        });
    });
}

// Format card number input
function setupCardInputs() {
    const cardNumber = document.getElementById("cardNumber");
    if (cardNumber) {
        cardNumber.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const cardExpiry = document.getElementById("cardExpiry");
    if (cardExpiry) {
        cardExpiry.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cardCVV = document.getElementById("cardCVV");
    if (cardCVV) {
        cardCVV.addEventListener("input", function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

// =======================
// ON LOAD
// =======================
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    setupPaymentHandlers();
    setupCardInputs();
});

console.log("checkout.js loaded");
