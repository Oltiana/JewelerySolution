// Lista e vathëve
/*const earrings = [
    { name: "Pearl Drop", price: 220, stock: 15, image: "images/41bc8579016491dfd017a40a7a112ea3.jpg" },
    { name: "Bold Muse", price: 780, stock: 6, image: "images/a49aa8f5f44e8d0fe491a0b528d3d4fa.jpg" },
    { name: "Flora", price: 120, stock: 0, image: "images/3ce062b5a0a7057447977a66d1d73d0b.jpg" },
    { name: "Celeste Pearl", price: 300, stock: 8, image: "images/1786769b3ad735e40ebdf0d9aca671ec.jpg" }
];*/

const category = "Earrings";

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
