const content = document.getElementById("accountContent");

// Statusi i përdoruesit dhe gjuha aktuale
let isLoggedIn = true;
let currentLang = "sq";
let currentSection = "";

// Tekste
const texts = {
    sq: {
        welcome: "Mirë se vini 👋", chooseOption: "Zgjidh një opsion nga llogaria.",
        personalData: "Të dhënat personale", orders: "Porositë", address: "Adresat", cards: "Kartelat e ruajtura",
        language: "Gjuha & Shteti", logout: "Shkyqu", addCard: "Shto kartelë të re",
        changePassword: "Ndrysho fjalëkalimin", cart: "Shporta juaj", emptyCart: "Nuk keni produkte në shportë",
        checkout: "Konfirmo Blerjen", paymentMethod: "Zgjidh metodën e pagesës",
        deliveryDate: "Zgjidh datën e dorëzimit", buyNow: "Blej Menjëherë", remove: "Fshi"
    },
    en: {
        welcome: "Welcome 👋", chooseOption: "Choose an option from your account.",
        personalData: "Personal Data", orders: "Orders", address: "Addresses", cards: "Saved Cards",
        language: "Language & Country", logout: "Logout", addCard: "Add New Card",
        changePassword: "Change Password", cart: "Your Cart", emptyCart: "No products in the cart",
        checkout: "Confirm Purchase", paymentMethod: "Select payment method",
        deliveryDate: "Select delivery date", buyNow: "Buy Now", remove: "Remove"
    }
};

// Kartelat dhe produktet
let cards = [{ number: "**** **** **** 1234", expiry: "08/27" }];
let cart = [];
let products = [
    { id: 1, name: "Unazë", price: 25, img: "https://via.placeholder.com/150?text=Unaze" },
    { id: 2, name: "Zinxhir", price: 15, img: "https://via.placeholder.com/150?text=Zinxhir" },
    { id: 3, name: "Vathë", price: 20, img: "https://via.placeholder.com/150?text=Vathe" }
];

// Navbar
function checkUser() {
    const accountMenu = document.querySelector(".dropdown-menu.dropdown-menu-end");
    if (isLoggedIn) {
        accountMenu.innerHTML = `
            <li><a class="dropdown-item" href="#" onclick="showProfile()"><i class="bi bi-person-circle me-2"></i>${texts[currentLang].personalData}</a></li>
            <li><a class="dropdown-item" href="#" onclick="showOrders()"><i class="bi bi-bag-check me-2"></i>${texts[currentLang].orders}</a></li>
            <li><a class="dropdown-item" href="#" onclick="showAddress()"><i class="bi bi-geo-alt me-2"></i>${texts[currentLang].address}</a></li>
            <li><a class="dropdown-item" href="#" onclick="showCards()"><i class="bi bi-credit-card me-2"></i>${texts[currentLang].cards}</a></li>
            <li><a class="dropdown-item" href="#" onclick="showLanguage()"><i class="bi bi-translate me-2"></i>${texts[currentLang].language}</a></li>
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

// Seksionet
function showProfile() { currentSection = "profile"; content.innerHTML = `<h4>${texts[currentLang].personalData}</h4><p><strong>Emri:</strong> Loreta</p><p><strong>Email:</strong> loreta@email.com</p><p><strong>Telefoni:</strong> +383 44 000 000</p><div class="mt-3"><button class="btn btn-outline-primary btn-sm me-2">${texts[currentLang].changePassword}</button></div>`; }
function showOrders() { currentSection = "orders"; content.innerHTML = `<h4>${texts[currentLang].orders}</h4><p>Nuk keni porosi aktive.</p>`; }
function showAddress() { currentSection = "address"; content.innerHTML = `<h4 class="mb-3">${texts[currentLang].address}</h4><div class="border rounded p-3 bg-light"><p class="mb-2 text-muted">Adresa aktuale</p><p id="currentAddress" class="fw-semibold mb-3">Rr. Nëna Terezë, Prishtinë</p><button class="btn btn-sm btn-outline-dark px-3" onclick="editAddress()"><i class="bi bi-pencil me-1"></i> Ndrysho</button></div>`; }
function editAddress() { const current = document.getElementById("currentAddress").innerText; content.innerHTML = `<h4 class="mb-3">${texts[currentLang].address}</h4><div class="border rounded p-3 bg-light w-75"><label class="form-label text-muted">Adresa e re</label><input type="text" class="form-control mb-3" id="newAddress" value="${current}"><div class="d-flex gap-2"><button class="btn btn-sm btn-dark px-3" onclick="saveAddress()">Ruaj</button><button class="btn btn-sm btn-outline-secondary px-3" onclick="showAddress()">Anulo</button></div></div>`; }
function saveAddress() { const newAddress = document.getElementById("newAddress").value; showAddress(); document.getElementById("currentAddress").innerText = newAddress; }

function showCards() { currentSection = "cards"; let html = `<h4>${texts[currentLang].cards}</h4><div class="d-flex flex-row gap-3 mt-3">`; cards.forEach((card, index) => { html += `<div class="card p-3" style="width:180px;position:relative;"><p class="mb-1">💳 ${card.number}</p><small>Skadon: ${card.expiry}</small><button class="btn btn-sm btn-danger position-absolute top-0 end-0" style="padding:0 5px;" onclick="deleteCard(${index})"><i class="bi bi-trash"></i></button></div>`; }); html += `</div><button class="btn btn-outline-primary mt-3" onclick="addCard()">${texts[currentLang].addCard}</button>`; content.innerHTML = html; }
function deleteCard(index) { if (confirm("A je i sigurt që dëshiron ta fshish këtë kartelë?")) { cards.splice(index, 1); showCards(); } }
function addCard() { const number = prompt("Shkruaj numrin e kartelës (vetëm 1234 për test)"); const expiry = prompt("Shkruaj datën e skadencës (MM/YY)"); if (number && expiry) { cards.push({ number, expiry }); showCards(); } else alert("Kartela nuk u shtua. Ploteso të dhënat!"); }

function showLanguage() { currentSection = "language"; content.innerHTML = `<h4>${texts[currentLang].language}</h4><div class="mb-3"><label>Zgjidh gjuhën:</label><select class="form-select w-50" onchange="changeLanguage(this.value)"><option value="sq" ${currentLang === 'sq' ? 'selected' : ''}>Shqip</option><option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option></select></div>`; }
function changeLanguage(lang) { currentLang = lang; checkUser(); refreshContent(); }
function refreshContent() { switch (currentSection) { case "profile": showProfile(); break; case "orders": showOrders(); break; case "address": showAddress(); break; case "cards": showCards(); break; case "language": showLanguage(); break; case "cart": showCart(); break; case "products": showProducts(); break; default: content.innerHTML = `<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`; } }

function showLogin() { alert("Login form"); }
function showRegister() { alert("Register form"); }
function logout() { alert("Ju u shkyqët!"); isLoggedIn = false; checkUser(); currentSection = ""; content.innerHTML = `<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`; }

// Produkte dhe shporta
function addToCart(id) { const prod = products.find(p => p.id === id); cart.push(prod); document.getElementById("cartCount").innerText = cart.length; alert(prod.name + " u shtua në shportë!"); }
function showCart() { currentSection = "cart"; let html = `<h4>${texts[currentLang].cart}</h4>`; if (cart.length === 0) { html += `<p>${texts[currentLang].emptyCart}</p>`; } else { cart.forEach((item, index) => { html += `<div class="card mb-2 p-2 d-flex flex-row align-items-center"><img src="${item.img}" alt="${item.name}" style="height:50px;margin-right:10px;"><div><p class="mb-1">${item.name}</p><small>Çmimi: $${item.price}</small></div><button class="btn btn-sm btn-danger ms-auto" onclick="removeFromCart(${index})"><i class="bi bi-trash"></i> ${texts[currentLang].remove}</button><button class="btn btn-sm btn-success ms-2" onclick="checkout(${index})">${texts[currentLang].buyNow}</button></div>`; }); } content.innerHTML = html; }
function removeFromCart(index) { cart.splice(index, 1); document.getElementById("cartCount").innerText = cart.length; showCart(); }
function checkout(index) { const item = cart[index]; content.innerHTML = `<h4>Blerja e: ${item.name}</h4><p>Çmimi: $${item.price}</p><label>${texts[currentLang].paymentMethod}:</label><select class="form-select w-50 mb-3" id="paymentMethod"><option value="online">Pagesa Online</option><option value="cash">Para në dorë</option></select><label>${texts[currentLang].deliveryDate}:</label><input type="date" class="form-control w-50 mb-3" id="deliveryDate"><button class="btn btn-primary" onclick="confirmPurchase(${index})">${texts[currentLang].checkout}</button><button class="btn btn-secondary ms-2" onclick="showCart()">Kthehu te Shporta</button>`; }
function confirmPurchase(index) { const method = document.getElementById("paymentMethod").value; const date = document.getElementById("deliveryDate").value; if (!date) { alert("Zgjidh një datë!"); return; } const item = cart.splice(index, 1)[0]; alert(`Blerja e ${item.name} u krye me sukses!\nMetoda: ${method}\nData: ${date}`); document.getElementById("cartCount").innerText = cart.length; showCart(); }

function showProducts() { currentSection = "products"; let html = "<h4>Produktet</h4><div class='d-flex flex-wrap gap-3'>"; products.forEach(prod => { html += `<div class="card p-2" style="width:180px;"><img src="${prod.img}" alt="${prod.name}" style="height:100px;width:100%;"><p class="mb-1 mt-2">${prod.name}</p><p>Çmimi: $${prod.price}</p><button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})">Shto në Shportë</button></div>`; }); html += "</div>"; content.innerHTML = html; }

// Load
window.onload = () => {
    checkUser();
    content.innerHTML = `<h4>${texts[currentLang].welcome}</h4><p>${texts[currentLang].chooseOption}</p>`;
}
