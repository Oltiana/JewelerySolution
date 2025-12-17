
const rings = [
    { name: "Rosé Dream", price: 350, stock: 20, image: "images/image_2025-06-28_23-16-53-273.jpg" },
    { name: "Pure Heart", price: 950, stock: 10, image: "images/image_2025-06-28_23-16-53-545.jpg" },
    { name: "Golden Whisper", price: 180, stock: 4, image: "images/image_2025-06-28_23-21-24-974.jpg" },
    { name: "Royal Marquise", price: 180, stock: 0, image: "images/f1182b5df995d2cb0cc81d59eb2cb55f.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayRings(data) {
    const container = document.getElementById("ringsContainer");
    container.innerHTML = "";

    data.forEach(ring => {
        container.innerHTML += `
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card ring-card">
          <img src="${ring.image}" class="card-img-top" alt="${ring.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${ring.name}</h5>
            <p class="price">€${ring.price}</p>
            <p class="stock text-muted">Në stok: ${ring.stock}</p>
            <button class="btn add-btn addCartBtn"
                data-name="${ring.name}"
                data-price="${ring.price}"
                data-image="${ring.image}"
                ${ring.stock === 0 ? 'disabled' : ''}>
                ${ring.stock === 0 ? 'Nuk ka stok' : 'Shto në Shportë'}
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

displayRings(rings);
