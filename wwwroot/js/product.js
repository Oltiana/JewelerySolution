
const categories = [
    {
        name: "Rings",
        image: "images/95296a86affce88cd67535d6e1f5c9c0.jpg",
        description: "Elegant rings for every occasion",
        link: "rings.html"
    },
    {
        name: "Earrings",
        image: "images/3607fecf56d7db494169543c20e7b9fb.jpg",
        description: "Stylish earrings for any outfit",
        link: "earrings.html"
    },
    {
        name: "Necklaces",
        image: "images/18324b57a8f1b24c700c775d67ade83f.jpg",
        description: "Beautiful necklaces to shine",
        link: "necklaces.html"
    }
];

function displayCategories() {
    const container = document.querySelector(".row");
    container.innerHTML = "";

    categories.forEach(c => {
        container.innerHTML += `
      <div class="col-md-4">
        <a href="${c.link}" class="category-link d-block text-decoration-none text-center">
          <div class="category-card">
            <img src="${c.image}" alt="${c.name}">
            <p>${c.name}</p>
            <p class="description">${c.description}</p>
            <button class="btn">See More</button>
          </div>
        </a>
      </div>
    `;
    });
}

displayCategories();
