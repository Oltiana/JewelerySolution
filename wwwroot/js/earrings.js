const earrings = [
    {
        name: "Pearl Drop",
        price: 220,
        stock: 15,
        image: "images/41bc8579016491dfd017a40a7a112ea3.jpg"
    },
    {
        name: "Bold Muse",
        price: 780,
        stock: 6,
        image: "images/a49aa8f5f44e8d0fe491a0b528d3d4fa.jpg"
    },
    {
        name: "Flora",
        price: 120,
        stock: 0,
        image: "images/3ce062b5a0a7057447977a66d1d73d0b.jpg"
    },
    {
        name: "Celeste Pearl",
        price: 300,
        stock: 8,
        image: "images/1786769b3ad735e40ebdf0d9aca671ec.jpg"
    }
];

function displayEarrings(data) {
    const container = document.getElementById("earringsContainer");
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

displayEarrings(earrings);