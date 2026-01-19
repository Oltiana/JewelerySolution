
/*const rings = [
    { name: "Rosé Dream", price: 350, stock: 20, image: "images/image_2025-06-28_23-16-53-273.jpg" },
    { name: "Pure Heart", price: 950, stock: 10, image: "images/image_2025-06-28_23-16-53-545.jpg" },
    { name: "Golden Whisper", price: 180, stock: 4, image: "images/image_2025-06-28_23-21-24-974.jpg" },
    { name: "Royal Marquise", price: 180, stock: 0, image: "images/f1182b5df995d2cb0cc81d59eb2cb55f.jpg" }
];*/
const category = "Rings";

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
