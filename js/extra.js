const categorySection = document.getElementById("category-section");
let categoriesData = [];
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => {
      categoriesData = data.categories; // Store in global variable
      displayCategories(categoriesData);
    })
    .catch((error) => console.log(error));
};

const displayCategories = (catagories) => {
  catagories.map((item) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.innerHTML = `
          <button id="btn-${item.category_id}" onclick="activeShow(this)" class="btn category-btn">
          ${item.category}
          </button>
      `;
    categorySection.appendChild(categoryContainer);
  });
};

const activeShow = (button) => {
  button.classList.add("bg-red-500");
  button.classList.add("text-white");
};

loadCategories();
