const container = document.getElementById("ringsContainer");
const category = "Rings";

fetch(`/api/products/category/${category}`)
    .then(res => res.json())
    .then(products => {
        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = "<p>No products found.</p>";
            return;
        }

        products.forEach(p => {
            container.innerHTML += `
                <div class="col-md-4 col-lg-3">
                    <div class="card ring-card">
                        <img src="${p.imageUrl}" class="card-img-top" alt="${p.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${p.name}</h5>
                            <p class="price">€${p.price}</p>
                            <p class="stock">Stock: ${p.stock}</p>
                            <button class="add-btn" ${p.stock === 0 ? "disabled" : ""}>
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });



    })
    .catch(err => {
        console.error(err);
        container.innerHTML = "<p>Error loading products</p>";
    });
