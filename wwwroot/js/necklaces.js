const necklaces = [
    {
        name: "Golden Sun",
        price: 420,
        stock: 12,
        image: "images/image_2025-07-11_13-53-29-496.jpg"
    },
    {
        name: "Ivory Grace",
        price: 1200,
        stock: 5,
        image: "images/4d19e6cce6fa26027c4affb7b65de5cc.jpg"
    },
    {
        name: "Pure Muse",
        price: 210,
        stock: 0,
        image: "images/image_2025-07-11_13-59-04-021.jpg"
    },
    {
        name: "Clarity",
        price: 480,
        stock: 7,
        image: "images/image_2025-07-11_14-01-31-012.jpg"
    }
];

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
              <button class="btn add-btn" ${item.stock === 0 ? 'disabled' : ''}>
                ${item.stock === 0 ? 'Nuk ka stok' : 'Shto në Shportë'}
              </button>
            </div>
          </div>
        </div>
      `;
    });
}

displayNecklaces(necklaces);