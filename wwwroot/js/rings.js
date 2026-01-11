
/*const rings = [
    { name: "Rosé Dream", price: 350, stock: 20, image: "images/image_2025-06-28_23-16-53-273.jpg" },
    { name: "Pure Heart", price: 950, stock: 10, image: "images/image_2025-06-28_23-16-53-545.jpg" },
    { name: "Golden Whisper", price: 180, stock: 4, image: "images/image_2025-06-28_23-21-24-974.jpg" },
    { name: "Royal Marquise", price: 180, stock: 0, image: "images/f1182b5df995d2cb0cc81d59eb2cb55f.jpg" }
];*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayProducts(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    data.forEach(item => {
        container.innerHTML += `
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card ring-card">
          <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${item.name}</h5>
            <p class="price">€${item.price}</p>
            <p class="stock text-muted">Në stok: ${item.stock}</p>
            <button class="btn add-btn addCartBtn"
                data-name="${item.name}"
                data-price="${item.price}"
                data-image="${item.imageUrl}"
                ${item.stock === 0 ? 'disabled' : ''}>
                ${item.stock === 0 ? 'Nuk ka stok' : 'Shto në Shportë'}
            </button>
          </div>
        </div>
      </div>
    `;
    });

    document.querySelectorAll(".addCartBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = cart.findIndex(x => x.name === btn.dataset.name);

            if (index > -1) {
                cart[index].qty += 1;
            } else {
                cart.push({
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image,
                    qty: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${btn.dataset.name} u shtua në shportë!`);
        });
    });
}

// Fetch produktet nga API për Rings
fetch('/api/Products/category/Rings')
    .then(res => res.json())
    .then(data => displayProducts(data, 'ringsContainer'))
    .catch(err => console.error(err));

