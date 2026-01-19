fetch("/api/products")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("products");
        container.innerHTML = "";

        data.forEach(p => {
            container.innerHTML += `
        <div class="product">
          <img src="/images/${p.imageUrl}" alt="${p.name}">
          <h4>${p.name}</h4>
          <p>€${p.price}</p>
        </div>
      `;
        });
    })
    .catch(err => console.error("API error:", err));
