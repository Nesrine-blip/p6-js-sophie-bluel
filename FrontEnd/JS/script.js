// ===== API URLs =====
const baseUrl = "http://localhost:5678/api/";
const worksUrl = baseUrl + "works";
const categoriesUrl = baseUrl + "categories";

// ===== DOM Elements =====
const gallerySection = document.querySelector(".gallery");
const filtersContainer = document.getElementById("filtres");
const editBanner = document.getElementById("edition-banner");

let allWorks = [];

// ===== Fetch works from API =====
async function fetchWorks() {
  const response = await fetch(worksUrl);
  return response.ok ? await response.json() : [];
}

// ===== Fetch categories from API =====
async function fetchCategories() {
  const response = await fetch(categoriesUrl);
  return response.ok ? await response.json() : [];
}

// ===== Display all works in the gallery =====
function displayWorks(works) {
  // Clear gallery first
  gallerySection.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    caption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallerySection.appendChild(figure);
  });
}

// ===== Create filter buttons =====
function displayFilters(categories) {
  // "All" button
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("bouton-css", "selected");
  allBtn.dataset.id = "0";
  filtersContainer.appendChild(allBtn);

  // Buttons for each category
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("bouton-css");
    button.dataset.id = category.id;
    filtersContainer.appendChild(button);
  });
}

// ===== Filter logic when a button is clicked =====
filtersContainer.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON") {
    const selectedId = parseInt(event.target.dataset.id);

    // Highlight the selected button
    document.querySelectorAll(".bouton-css").forEach(btn => btn.classList.remove("selected"));
    event.target.classList.add("selected");

    // Show filtered works
    if (selectedId === 0) {
      displayWorks(allWorks); // Show all
    } else {
      const filtered = allWorks.filter(work => work.categoryId === selectedId);
      displayWorks(filtered);
    }
  }
});

// ===== Initialization function (runs at startup) =====
async function init() {
  allWorks = await fetchWorks();
  const categories = await fetchCategories();

  if (allWorks.length > 0) {
    displayWorks(allWorks);
    displayFilters(categories);
  } else {
    console.error("Erreur : impossible de charger les projets");
  }
}

// ===== Launch app =====
init();

// ===== UI updates for login/logout =====
document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("auth-btn");
  const editBanner = document.getElementById("edition-banner");
  const adminBanner = document.getElementById("admin-banner"); // Black admin banner

  // Update UI depending on login status
  function updateAuthUI() {
    const token = sessionStorage.getItem("authToken");
    const isLoggedIn = !!token;

    // Change button text and behavior
    authBtn.textContent = isLoggedIn ? "Logout" : "Login";
    authBtn.onclick = isLoggedIn
      ? handleLogout
      : () => (window.location.href = "login.html");

    // Show/hide admin elements
    if (editBanner) editBanner.style.display = isLoggedIn ? "flex" : "none";
    if (adminBanner) adminBanner.style.display = isLoggedIn ? "flex" : "none";
  }

  // Handle logout logic
  function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem("authToken");
    updateAuthUI();
  }

  // Initial UI update on page load
  updateAuthUI();
});
