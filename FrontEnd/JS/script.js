// ===== API URLs =====
const baseUrl = "http://localhost:5678/api/";
const worksUrl = baseUrl + "works";
const categoriesUrl = baseUrl + "categories";

// ===== DOM Elements =====
const gallerySection = document.querySelector(".gallery");
const filtersContainer = document.getElementById("filtres");
const editBanner = document.getElementById("edition-banner");

let allWorks = [];

// ===== Fetch Data =====
async function fetchWorks() {
  const response = await fetch(worksUrl);
  return response.ok ? await response.json() : []
}

async function fetchCategories() {
  const response = await fetch(categoriesUrl);
  return response.ok ? await response.json() : [];
}

// ===== Display Works in Gallery =====
function displayWorks(works) {
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

// ===== Display Filters Dynamically =====
function displayFilters(categories) {
  // "All" button
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("bouton-css", "selected");
  allBtn.dataset.id = "0";
  filtersContainer.appendChild(allBtn);

  // Category buttons
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("bouton-css");
    button.dataset.id = category.id;
    filtersContainer.appendChild(button);
  });
}

// ===== Filter Logic =====
filtersContainer.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON") {
    const selectedId = parseInt(event.target.dataset.id);

    // Update selected button style
    document.querySelectorAll(".bouton-css").forEach(btn => btn.classList.remove("selected"));
    event.target.classList.add("selected");

    // Filter works
    if (selectedId === 0) {
      displayWorks(allWorks);
    } else {
      const filtered = allWorks.filter(work => work.categoryId === selectedId);
      displayWorks(filtered);
    }
  }
});

// ===== Startup Function =====
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



// ===== Launch Site =====
init();




document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("auth-btn");
  const editBanner = document.getElementById("edition-banner");
  const adminBanner = document.getElementById("admin-banner"); // nouveau bandeau noir

  function updateAuthUI() {
    const token = sessionStorage.getItem("authToken");

    const isLoggedIn = !!token;

    // Mettre à jour le bouton de connexion/déconnexion
    authBtn.textContent = isLoggedIn ? "Logout" : "Login";
    authBtn.onclick = isLoggedIn
      ? handleLogout
      : () => (window.location.href = "login.html");

    
    if (editBanner) editBanner.style.display = isLoggedIn ? "flex" : "none";
    if (adminBanner) adminBanner.style.display = isLoggedIn ? "flex" : "none";
  }

  function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem("authToken");
    updateAuthUI(); 
  }

  updateAuthUI(); 
});
