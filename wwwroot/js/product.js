
function getImageUrl(img) {
    if (!img) return '/images/default.jpg';
    if (img.startsWith('/')) return img;
    return '/images/' + img;
}

fetch('https://localhost:7075/api/products')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('products');
        container.innerHTML = '';

        data.forEach(p => {
            container.innerHTML += `
        <div class="product-card">
          <img src="${getImageUrl(p.imageUrl)}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.price} €</p>
        </div>
      `;
        });
    })
    .catch(err => console.error(err));

