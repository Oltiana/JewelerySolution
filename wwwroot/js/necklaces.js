
const necklaces = [
    { name: "Golden Sun", price: 420, stock: 12, image: "images/image_2025-07-11_13-53-29-496.jpg" },
    { name: "Ivory Grace", price: 1200, stock: 5, image: "images/4d19e6cce6fa26027c4affb7b65de5cc.jpg" },
    { name: "Pure Muse", price: 210, stock: 0, image: "images/image_2025-07-11_13-59-04-021.jpg" },
    { name: "Clarity", price: 480, stock: 7, image: "images/image_2025-07-11_14-01-31-012.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayNecklaces(data) {
    const container = document.getElementById("necklacesContainer");
    container.innerHTML = "";

    data.forEach(item => {
        container.innerHTML += `
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card ring-card">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${item.name}</h5>
            <p class="price">€${item.price}</p>
            <p class="stock text-muted">Në stok: ${item.stock}</p>
            <button class="btn add-btn addCartBtn"
                data-name="${item.name}"
                data-price="${item.price}"
                data-image="${item.image}"
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

displayNecklaces(necklaces);
