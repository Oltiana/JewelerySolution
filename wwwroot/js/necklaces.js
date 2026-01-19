
/*const necklaces = [
    { name: "Golden Sun", price: 420, stock: 12, image: "images/image_2025-07-11_13-53-29-496.jpg" },
    { name: "Ivory Grace", price: 1200, stock: 5, image: "images/4d19e6cce6fa26027c4affb7b65de5cc.jpg" },
    { name: "Pure Muse", price: 210, stock: 0, image: "images/image_2025-07-11_13-59-04-021.jpg" },
    { name: "Clarity", price: 480, stock: 7, image: "images/image_2025-07-11_14-01-31-012.jpg" }
];*/

const category = "Necklaces";

fetch("/api/products")
    .then(r => r.json())
    .then(data => {
        const filtered = data.filter(p => p.category?.name === category);

        filtered.forEach(p => {
            products.innerHTML += `
        <div class="product">
          <img src="/images/${p.imageUrl}">
          <h4>${p.name}</h4>
          <p>€${p.price}</p>
        </div>
      `;
        });
    });
