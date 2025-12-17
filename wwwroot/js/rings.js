
const rings = [
    {
        name: "Rosé Dream",
        price: 350,
        stock: 20,
        image: "images/image_2025-06-28_23-16-53-273.jpg"
    },
    {
        name: "Pure Heart",
        price: 950,
        stock: 10,
        image: "images/image_2025-06-28_23-16-53-545.jpg"
    },
    {
        name: "Golden Whisper",
        price: 180,
        stock: 4,
        image: "images/image_2025-06-28_23-21-24-974.jpg"
    },
    {
        name: "Royal Marquise",
        price: 180,
        stock: 0,
        image: "images/f1182b5df995d2cb0cc81d59eb2cb55f.jpg"
    }

];

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
              <button class="btn add-btn" ${ring.stock === 0 ? 'disabled' : ''}>
                ${ring.stock === 0 ? 'Nuk ka stok' : 'Shto në Shportë'}
              </button>
            </div>
          </div>
        </div>
      `;
    });
}

displayRings(rings);
