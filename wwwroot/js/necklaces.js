document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById("necklacesContainer");
    if (!container) {
        console.error("necklacesContainer not found");
        return;
    }

    const category = "Necklaces";

    fetch(`/api/products/category/${category}`)
        .then(res => res.json())
        .then(products => {
            container.innerHTML = "";

            if (products.length === 0) {
                container.innerHTML = "<p>No necklaces found.</p>";
                return;
            }

            products.forEach((p, index) => {
                container.innerHTML += `
                    <div class="col-md-4 col-lg-3">
                        <div class="card ring-card">
                            <img src="${p.imageUrl}" class="card-img-top" alt="${p.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${p.name}</h5>
                                <p class="price">€${p.price}</p>
                                <p class="stock">Stock: ${p.stock}</p>
                                <button class="add-btn" ${p.stock === 0 ? "disabled" : ""} onclick="addProductToCart(${p.id}, '${p.name}', ${p.price}, '${p.imageUrl}')">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<p>Error loading products</p>";
        });
});

// Funksioni për të shtuar produkt në shportë
function addProductToCart(id, name, price, imageUrl) {
    // Merr shportën aktuale nga localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Kontrollo nëse produkti ekziston tashmë në shportë
    const existingItem = cart.findIndex(x => x.name === name);
    if (existingItem > -1) {
        // Nëse produkti ekziston, rrit sasinë
        cart[existingItem].qty += 1;
    } else {
        // Shto produkt të ri
        cart.push({
            id: id,
            name: name,
            price: price,
            image: imageUrl,
            qty: 1
        });
    }
    
    // Ruaj shportën në localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Përditëso badge në navbar
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        cartBadge.textContent = totalItems;
    }
    
    // Shfaq mesazh konfirmimi
    alert(`${name} u shtua në shportë!`);
}
