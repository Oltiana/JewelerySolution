let content = null; // Do të merret kur DOM është gati

let isLoggedIn = true;
let currentLang = localStorage.getItem("userLanguage") || "sq";
let currentCountry = localStorage.getItem("userCountry") || "Kosovë";
let currentSection = "";

// Helper function për të kontrolluar nëse accountContent ekziston
function setContentIfExists(html) {
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    }
}

// Load user data nga localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem("userData")) || {
        firstName: "Loreta",
        lastName: "Bilalli",
        email: "loreta@email.com",
        phone: "+383 44 000 000",
        country: "Kosovë"
    };
    return userData;
}

// Save user data në localStorage
function saveUserData(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
}

// Load cards nga localStorage
function loadCards() {
    return JSON.parse(localStorage.getItem("userCards")) || [{ number: "**** **** **** 1234", expiry: "08/27" }];
}

// Save cards në localStorage
function saveCards(cards) {
    localStorage.setItem("userCards", JSON.stringify(cards));
}

// Load orders nga localStorage
function loadOrders() {
    return JSON.parse(localStorage.getItem("userOrders")) || [];
}

// Save order në localStorage
function saveOrder(order) {
    const orders = loadOrders();
    orders.push(order);
    localStorage.setItem("userOrders", JSON.stringify(orders));
}

// Remove order nga localStorage
function removeOrder(orderId) {
    const orders = loadOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    localStorage.setItem("userOrders", JSON.stringify(filtered));
}

const texts = {
    sq: {
        welcome: "Mirë se vini 👋", chooseOption: "Zgjidh një opsion nga llogaria.",
        personalData: "Të dhënat personale", orders: "Porositë", address: "Adresat", cards: "Kartelat e ruajtura",
        language: "Gjuha & Shteti", logout: "Shkyqu", addCard: "Shto kartelë të re",
        changePassword: "Ndrysho fjalëkalimin", cart: "Shporta juaj", emptyCart: "Nuk keni produkte në shportë",
        checkout: "Konfirmo Blerjen", paymentMethod: "Zgjidh metodën e pagesës",
        deliveryDate: "Zgjidh datën e dorëzimit", buyNow: "Blej Menjëherë", remove: "Fshi",
        name: "Emri", email: "Email", phone: "Telefoni", country: "Vendi", cancel: "Anulo",
        noOrders: "Nuk keni porosi aktive.", orderId: "ID Porosie", total: "Totali", status: "Statusi",
        pending: "Në pritje", shipped: "Dërguar", cancelled: "Anuluar", selectLanguage: "Zgjidh gjuhën:",
        selectCountry: "Zgjidh shtetin:", save: "Ruaj", cancelBtn: "Anulo"
    },
    en: {
        welcome: "Welcome 👋", chooseOption: "Choose an option from your account.",
        personalData: "Personal Data", orders: "Orders", address: "Addresses", cards: "Saved Cards",
        language: "Language & Country", logout: "Logout", addCard: "Add New Card",
        changePassword: "Change Password", cart: "Your Cart", emptyCart: "No products in the cart",
        checkout: "Confirm Purchase", paymentMethod: "Select payment method",
        deliveryDate: "Select delivery date", buyNow: "Buy Now", remove: "Remove",
        name: "Name", email: "Email", phone: "Phone", country: "Country", cancel: "Cancel",
        noOrders: "No active orders.", orderId: "Order ID", total: "Total", status: "Status",
        pending: "Pending", shipped: "Shipped", cancelled: "Cancelled", selectLanguage: "Select language:",
        selectCountry: "Select country:", save: "Save", cancelBtn: "Cancel"
    }
};

let cart = [];
let products = [
    { id: 1, name: "Unazë", price: 25, img: "https://via.placeholder.com/150?text=Unaze" },
    { id: 2, name: "Zinxhir", price: 15, img: "https://via.placeholder.com/150?text=Zinxhir" },
    { id: 3, name: "Vathë", price: 20, img: "https://via.placeholder.com/150?text=Vathe" }
];

// Update page language
function updatePageLanguage() {
    // Update navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    // Update page title dhe përmbajtje tjetër nëse ka
    document.documentElement.lang = currentLang;
}

function checkUser() {
    const accountMenu = document.querySelector(".dropdown-menu.dropdown-menu-end");
    if (accountMenu) {
        if (isLoggedIn) {
            accountMenu.innerHTML = `
                <li><a class="dropdown-item" href="navbar.html" onclick="event.preventDefault(); showProfile();"><i class="bi bi-person-circle me-2"></i>${texts[currentLang].personalData}</a></li>
                <li><a class="dropdown-item" href="navbar.html" onclick="event.preventDefault(); showOrders();"><i class="bi bi-bag-check me-2"></i>${texts[currentLang].orders}</a></li>
                <li><a class="dropdown-item" href="navbar.html" onclick="event.preventDefault(); showAddress();"><i class="bi bi-geo-alt me-2"></i>${texts[currentLang].address}</a></li>
                <li><a class="dropdown-item" href="navbar.html" onclick="event.preventDefault(); showCards();"><i class="bi bi-credit-card me-2"></i>${texts[currentLang].cards}</a></li>
                <li><a class="dropdown-item" href="navbar.html" onclick="event.preventDefault(); showLanguage();"><i class="bi bi-translate me-2"></i>${texts[currentLang].language}</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>${texts[currentLang].logout}</a></li>
            `;
        } else {
            accountMenu.innerHTML = `
                <li><a class="dropdown-item" href="#" onclick="showLogin()">Login</a></li>
                <li><a class="dropdown-item" href="#" onclick="showRegister()">Register</a></li>
            `;
        }
    }
}

function showProfile() {
    currentSection = "profile";
    const userData = loadUserData();
    const html = `
        <h4>${texts[currentLang].personalData}</h4>
        <div class="mt-3">
            <p><strong>${texts[currentLang].name}:</strong> ${userData.firstName} ${userData.lastName}</p>
            <p><strong>${texts[currentLang].email}:</strong> ${userData.email}</p>
            <p><strong>${texts[currentLang].phone}:</strong> ${userData.phone}</p>
            <p><strong>${texts[currentLang].country}:</strong> ${userData.country}</p>
        </div>
    `;
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    } else {
        // Nëse nuk jemi në navbar.html, ridrejto me parametra URL
        window.location.href = "navbar.html?section=profile";
    }
}

function showOrders() {
    currentSection = "orders";
    const orders = loadOrders();
    let html = `<h4>${texts[currentLang].orders}</h4>`;
    
    if (orders.length === 0) {
        html += `<p class="mt-3">${texts[currentLang].noOrders}</p>`;
    } else {
        html += `<div class="mt-3">`;
        orders.forEach(order => {
            const statusClass = order.status === "Pending" ? "warning" : order.status === "Shipped" ? "success" : "danger";
            const statusText = order.status === "Pending" ? texts[currentLang].pending : 
                             order.status === "Shipped" ? texts[currentLang].shipped : 
                             texts[currentLang].cancelled;
            html += `
                <div class="card mb-3 p-3">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <p class="mb-1"><strong>${texts[currentLang].orderId}:</strong> #${order.id || order.orderId || 'N/A'}</p>
                            <p class="mb-1"><strong>${texts[currentLang].total}:</strong> €${(order.total || 0).toFixed(2)}</p>
                            <p class="mb-0"><strong>${texts[currentLang].status}:</strong> 
                                <span class="badge bg-${statusClass}">${statusText}</span>
                            </p>
                        </div>
                        ${order.status === "Pending" ? `
                            <button class="btn btn-sm btn-danger" onclick="cancelOrder('${order.id || order.orderId}')">
                                ${texts[currentLang].cancel}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    } else {
        // Nëse nuk jemi në navbar.html, ridrejto
        window.location.href = "navbar.html?section=orders";
    }
}

function cancelOrder(orderId) {
    if (confirm("A je i sigurt që dëshiron ta anulosh këtë porosi?")) {
        removeOrder(orderId);
        showOrders();
    }
}

function showAddress() {
    currentSection = "address";
    const userData = loadUserData();
    const address = userData.address || "Rr. Nëna Terezë, Prishtinë";
    const html = `
        <h4 class="mb-3">${texts[currentLang].address}</h4>
        <div class="border rounded p-3 bg-light">
            <p class="mb-2 text-muted">Adresa aktuale</p>
            <p id="currentAddress" class="fw-semibold mb-3">${address}</p>
            <button class="btn btn-sm btn-outline-dark px-3" onclick="editAddress()">
                <i class="bi bi-pencil me-1"></i> Ndrysho
            </button>
        </div>
    `;
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    } else {
        // Nëse nuk jemi në navbar.html, ridrejto me parametra URL
        window.location.href = "navbar.html?section=address";
    }
}

function editAddress() {
    const userData = loadUserData();
    const current = userData.address || "Rr. Nëna Terezë, Prishtinë";
    const html = `
        <h4 class="mb-3">${texts[currentLang].address}</h4>
        <div class="border rounded p-3 bg-light w-75">
            <label class="form-label text-muted">Adresa e re</label>
            <input type="text" class="form-control mb-3" id="newAddress" value="${current}">
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-dark px-3" onclick="saveAddress()">${texts[currentLang].save}</button>
                <button class="btn btn-sm btn-outline-secondary px-3" onclick="showAddress()">${texts[currentLang].cancelBtn}</button>
            </div>
        </div>
    `;
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    }
}

function saveAddress() {
    const newAddress = document.getElementById("newAddress")?.value || "";
    const userData = loadUserData();
    userData.address = newAddress;
    saveUserData(userData);
    showAddress();
}

function showCards() {
    currentSection = "cards";
    const cards = loadCards();
    let html = `<h4>${texts[currentLang].cards}</h4><div class="d-flex flex-row gap-3 mt-3">`;
    cards.forEach((card, index) => {
        html += `
            <div class="card p-3" style="width:180px;position:relative;">
                <p class="mb-1">💳 ${card.number}</p>
                <small>Skadon: ${card.expiry}</small>
                <button class="btn btn-sm btn-danger position-absolute top-0 end-0" style="padding:0 5px;" onclick="deleteCard(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });
    html += `</div><button class="btn btn-outline-primary mt-3" onclick="addCard()">${texts[currentLang].addCard}</button>`;
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    } else {
        // Nëse nuk jemi në navbar.html, ridrejto me parametra URL
        window.location.href = "navbar.html?section=cards";
    }
}

function deleteCard(index) {
    if (confirm("A je i sigurt që dëshiron ta fshish këtë kartelë?")) {
        const cards = loadCards();
        cards.splice(index, 1);
        saveCards(cards);
        showCards();
    }
}

function addCard() {
    const number = prompt("Shkruaj numrin e kartelës:");
    const expiry = prompt("Shkruaj datën e skadencës (MM/YY):");
    if (number && expiry) {
        const cards = loadCards();
        cards.push({ number, expiry });
        saveCards(cards);
        showCards();
    } else {
        alert("Kartela nuk u shtua. Ploteso të dhënat!");
    }
}

function showLanguage() {
    currentSection = "language";
    const userData = loadUserData();
    const html = `
        <h4>${texts[currentLang].language}</h4>
        <div class="mb-3">
            <label>${texts[currentLang].selectLanguage}</label>
            <select class="form-select w-50" id="languageSelect" onchange="changeLanguage(this.value)">
                <option value="sq" ${currentLang === 'sq' ? 'selected' : ''}>Shqip</option>
                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
            </select>
        </div>
        <div class="mb-3">
            <label>${texts[currentLang].selectCountry}</label>
            <select class="form-select w-50" id="countrySelect" onchange="changeCountry(this.value)">
                <option value="Kosovë" ${currentCountry === 'Kosovë' ? 'selected' : ''}>Kosovë</option>
                <option value="Shqipëri" ${currentCountry === 'Shqipëri' ? 'selected' : ''}>Shqipëri</option>
                <option value="Maqedoni" ${currentCountry === 'Maqedoni' ? 'selected' : ''}>Maqedoni</option>
            </select>
        </div>
    `;
    const accountContent = document.getElementById("accountContent");
    if (accountContent) {
        accountContent.innerHTML = html;
    } else {
        // Nëse nuk jemi në navbar.html, ridrejto me parametra URL
        window.location.href = "navbar.html?section=language";
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("userLanguage", lang);
    checkUser();
    refreshContent();
    updatePageLanguage();
}

function changeCountry(country) {
    currentCountry = country;
    localStorage.setItem("userCountry", country);
    const userData = loadUserData();
    userData.country = country;
    saveUserData(userData);
    showLanguage();
}

function refreshContent() {
    switch (currentSection) {
        case "profile": showProfile(); break;
        case "orders": showOrders(); break;
        case "address": showAddress(); break;
        case "cards": showCards(); break;
        case "language": showLanguage(); break;
        case "cart": showCart(); break;
        case "products": showProducts(); break;
        default: setContentIfExists(`<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`);
    }
}

function showLogin() { alert("Login form"); }
function showRegister() { alert("Register form"); }
function logout() {
    alert("Ju u shkyqët!");
    isLoggedIn = false;
    checkUser();
    currentSection = "";
    setContentIfExists(`<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`);
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.innerText = cart.length;
    alert(prod.name + " u shtua në shportë!");
}

function showCart() {
    currentSection = "cart";
    let html = `<h4>${texts[currentLang].cart}</h4>`;
    if (cart.length === 0) {
        html += `<p>${texts[currentLang].emptyCart}</p>`;
    } else {
        cart.forEach((item, index) => {
            html += `
                <div class="card mb-2 p-2 d-flex flex-row align-items-center">
                    <img src="${item.img}" alt="${item.name}" style="height:50px;margin-right:10px;">
                    <div>
                        <p class="mb-1">${item.name}</p>
                        <small>Çmimi: $${item.price}</small>
                    </div>
                    <button class="btn btn-sm btn-danger ms-auto" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i> ${texts[currentLang].remove}
                    </button>
                    <button class="btn btn-sm btn-success ms-2" onclick="checkout(${index})">
                        ${texts[currentLang].buyNow}
                    </button>
                </div>
            `;
        });
    }
    setContentIfExists(html);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.innerText = cart.length;
    showCart();
}

function checkout(index) {
    const item = cart[index];
    setContentIfExists(`
        <h4>Blerja e: ${item.name}</h4>
        <p>Çmimi: $${item.price}</p>
        <label>${texts[currentLang].paymentMethod}:</label>
        <select class="form-select w-50 mb-3" id="paymentMethod">
            <option value="online">Pagesa Online</option>
            <option value="cash">Para në dorë</option>
        </select>
        <label>${texts[currentLang].deliveryDate}:</label>
        <input type="date" class="form-control w-50 mb-3" id="deliveryDate">
        <button class="btn btn-primary" onclick="confirmPurchase(${index})">${texts[currentLang].checkout}</button>
        <button class="btn btn-secondary ms-2" onclick="showCart()">Kthehu te Shporta</button>
    `);
}

function confirmPurchase(index) {
    const method = document.getElementById("paymentMethod")?.value || "";
    const date = document.getElementById("deliveryDate")?.value || "";
    if (!date) {
        alert("Zgjidh një datë!");
        return;
    }
    const item = cart.splice(index, 1)[0];
    
    // Ruaj porosinë në localStorage
    const order = {
        id: Date.now().toString(),
        orderId: Date.now().toString(),
        items: [item],
        total: item.price,
        status: "Pending",
        date: date,
        paymentMethod: method
    };
    saveOrder(order);
    
    alert(`Blerja e ${item.name} u krye me sukses!\nMetoda: ${method}\nData: ${date}`);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.innerText = cart.length;
    showCart();
}

function showProducts() {
    currentSection = "products";
    let html = "<h4>Produktet</h4><div class='d-flex flex-wrap gap-3'>";
    products.forEach(prod => {
        html += `
            <div class="card p-2" style="width:180px;">
                <img src="${prod.img}" alt="${prod.name}" style="height:100px;width:100%;">
                <p class="mb-1 mt-2">${prod.name}</p>
                <p>Çmimi: $${prod.price}</p>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})">Shto në Shportë</button>
            </div>
        `;
    });
    html += "</div>";
    setContentIfExists(html);
}

// Update cart badge nga localStorage
function updateCartBadge() {
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        cartBadge.textContent = totalItems;
        if (totalItems === 0) {
            cartBadge.style.display = "none";
        } else {
            cartBadge.style.display = "block";
        }
    }
}

// Listen për order creation nga checkout.js
window.addEventListener('storage', function(e) {
    if (e.key === 'userOrders') {
        if (currentSection === 'orders') {
            showOrders();
        }
    }
});

// Listen për order creation nga checkout.js
window.addEventListener('storage', function(e) {
    if (e.key === 'userOrders') {
        if (currentSection === 'orders') {
            showOrders();
        }
    }
});

// Make functions globally available - duhet të jetë para window.onload
window.showProfile = showProfile;
window.showOrders = showOrders;
window.showAddress = showAddress;
window.showCards = showCards;
window.showLanguage = showLanguage;
window.logout = logout;
window.editAddress = editAddress;
window.saveAddress = saveAddress;
window.deleteCard = deleteCard;
window.addCard = addCard;
window.changeLanguage = changeLanguage;
window.changeCountry = changeCountry;
window.cancelOrder = cancelOrder;

// Initialize kur DOM është gati
document.addEventListener('DOMContentLoaded', function() {
    // Merr content elementin pasi DOM është gati
    content = document.getElementById("accountContent");
    
    // Load language dhe country nga localStorage
    currentLang = localStorage.getItem("userLanguage") || "sq";
    currentCountry = localStorage.getItem("userCountry") || "Kosovë";
    
    checkUser();
    updateCartBadge();
    updatePageLanguage();
    
    // Lexo parametrat URL dhe shfaq seksionin e duhur
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section && content) {
        switch(section) {
            case 'profile':
                showProfile();
                break;
            case 'orders':
                showOrders();
                break;
            case 'address':
                showAddress();
                break;
            case 'cards':
                showCards();
                break;
            case 'language':
                showLanguage();
                break;
            default:
                setContentIfExists(`<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`);
        }
    } else if (content) {
        // Vetëm nëse accountContent ekziston (në navbar.html, jo në products.html)
        // Por vetëm nëse nuk ka section parameter
        if (!section) {
            setContentIfExists(`<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`);
        }
    }
    
    // Përditëso badge çdo 500ms për të ndjekur ndryshimet në localStorage
    setInterval(updateCartBadge, 500);
});

window.onload = () => {
    // Përditëso badge kur faqja ngarkohet plotësisht
    updateCartBadge();
}

// Përditëso badge kur faqja shfaqet përsëri
window.addEventListener('focus', updateCartBadge);
