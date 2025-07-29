// ===================== API BASE =====================
const BASE_API = "http://localhost:5678/api/";

// Return full API URL (base + route)
function getApiUrl(route) {
  return `${BASE_API}${route}`;
}

// ===================== DOM ELEMENTS =====================

// --- Modals ---
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const modalPhoto = document.querySelector('#modal-photo');
const modalClose = document.querySelector('#modal-close');
const modalPhotoClose = document.querySelector("#modal-photo-close");

// --- Navigation Buttons ---
const newPhotoBtn = document.querySelector('#new-photo');
const returnBtn = document.querySelector('#modal-return');

// --- Form Inputs ---
const titleInput = document.getElementById('modal-photo-title');
const categorySelect = document.getElementById('modal-photo-category');
const imageInput = document.getElementById('image');
const submitButton = document.getElementById('modal-valider');

// --- Upload preview elements ---
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector("#form-photo-div > p");
const iconeImage = document.querySelector("#iModalImage");

// --- Gallery inside modal ---
const imagesModalContainer = document.querySelector('.gallery-modal');

// ===================== MODAL DISPLAY =====================

// Show the modal
function showModal() {
  modal.style.display = 'block';
  loadCategories();
  loadWorks();
}

// Hide the modal
function hideModal() {
  modal.style.display = 'none';
}

// Prevent closing when clicking inside modal
[modalContent, modalPhoto].forEach(el =>
  el.addEventListener('click', e => e.stopPropagation())
);

// Close modal when clicking outside or on close buttons
[modal, modalClose, modalPhotoClose].forEach(el =>
  el.addEventListener('click', hideModal)
);

// ===================== MODAL NAVIGATION =====================

// Switch to "Add Photo" view
newPhotoBtn.addEventListener('click', () => {
  modalContent.style.display = 'none';
  modalPhoto.style.display = 'block';
  resetAddPhotoForm();
});

// Return to main modal view
returnBtn.addEventListener('click', () => {
  modalContent.style.display = 'flex';
  modalPhoto.style.display = 'none';
});

// ===================== LOAD WORKS (GALLERY IN MODAL) =====================

// Create <figure> for one project
function createModalFigure(work) {
  const figure = document.createElement('figure');
  figure.dataset.id = work.id;

  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;

  const caption = document.createElement('figcaption');
  caption.textContent = "Modifier";

  const trashIcon = document.createElement('i');
  trashIcon.classList.add('fa-regular', 'fa-trash-can');

  // Delete this project when trash is clicked
  trashIcon.addEventListener('click', e => {
    e.preventDefault();
    deleteWorkById(work.id);
  });

  figure.appendChild(img);
  figure.appendChild(caption);
  figure.appendChild(trashIcon);

  return figure;
}

// Load all works into modal gallery
function loadWorks() {
  fetch(getApiUrl("works"))
    .then(res => res.json())
    .then(data => {
      imagesModalContainer.innerHTML = "";
      data.forEach(work => imagesModalContainer.appendChild(createModalFigure(work)));
    })
    .catch(err => console.error("Erreur lors du chargement des projets", err));
}

// ===================== DELETE ONE WORK =====================

// Delete a project by ID
function deleteWorkById(id) {
  const token = sessionStorage.getItem("authToken");
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

  fetch(getApiUrl(`works/${id}`), {
    method: 'DELETE',
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();

      // Remove from modal and homepage
      document.querySelectorAll(`figure[data-id="${id}"]`).forEach(f => f.remove());
      refreshGallery();
    })
    .catch(() => alert("Échec de la suppression du projet."));
}

// Refresh homepage gallery
function refreshGallery() {
  fetchWorks().then(works => {
    allWorks = works;
    displayWorks(allWorks);
  });
}

// ===================== DELETE ALL WORKS =====================

// Delete all projects on button click
document.getElementById("delete-gallery").addEventListener("click", () => {
  if (confirm("Supprimer toute la galerie ?")) deleteAllGallery();
});

// Loop through all and delete one by one
function deleteAllGallery() {
  const token = sessionStorage.getItem("authToken");

  document.querySelectorAll('.gallery-modal figure, .gallery figure').forEach(fig => {
    const id = fig.dataset.id;

    fetch(getApiUrl(`works/${id}`), {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    fig.remove();
  });
}

// ===================== ADD NEW WORK =====================

// On submit button click
submitButton.addEventListener("click", addNewWork);

// Add new project to modal + homepage
function addNewWork(event) {
  event.preventDefault();

  const title = titleInput.value;
  const category = categorySelect.value;
  const image = imageInput.files[0];
  const token = sessionStorage.getItem("authToken");

  // Basic validation
  if (!title || !category || !image) {
    return alert("Veuillez remplir tous les champs requis.");
  }

  if (image.size > 4 * 1024 * 1024) {
    return alert("L'image est trop volumineuse. Maximum 4 Mo.");
  }

  // Create form data for image upload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  fetch(getApiUrl("works"), {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      alert("Projet ajouté avec succès !");

      // Return to main modal
      modalPhoto.style.display = "none";
      modalContent.style.display = "flex";

      // Refresh galleries
      loadWorks();
      refreshGallery();

      // Reset form + preview
      document.getElementById("modal-photo-form").reset();
      document.querySelector("#form-photo-div img")?.remove();
      [labelImage, pImage, imageInput, iconeImage].forEach(el => el.style.display = "");
    })
    .catch(err => console.error("Erreur lors de l'ajout du projet", err));
}

// ===================== IMAGE PREVIEW =====================

// Show image preview after selecting a file
imageInput.addEventListener("change", () => {
  const image = imageInput.files[0];
  const preview = document.createElement("img");

  preview.src = URL.createObjectURL(image);
  preview.style.maxHeight = "100%";
  preview.style.width = "auto";

  // Hide upload icons/text
  [labelImage, pImage, imageInput, iconeImage].forEach(el => el.style.display = "none");

  document.getElementById("form-photo-div").appendChild(preview);
});

// ===================== BUTTON COLOR ON FORM COMPLETION =====================

// Update button color when form is complete
function checkFormCompletion() {
  submitButton.style.backgroundColor = (
    titleInput.value && categorySelect.value && imageInput.value
  ) ? '#1D6154' : '';
}

// Listen to form input changes
[titleInput, categorySelect, imageInput].forEach(el =>
  el.addEventListener('input', checkFormCompletion)
);

// ===================== LOAD CATEGORIES INTO SELECT =====================

function loadCategories() {
  fetch(getApiUrl("categories"))
    .then(res => res.json())
    .then(categories => {
      // Clear existing options
      categorySelect.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Sélectionnez une catégorie";
      categorySelect.appendChild(defaultOption);

      // Add categories to select
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    })
    .catch(err => console.error("Erreur lors du chargement des catégories", err));
}

// ===================== RESET FORM =====================

function resetAddPhotoForm() {
  document.querySelector("form").reset();

  const previewImage = document.querySelector("#form-photo-div img");
  if (previewImage) previewImage.remove();

  [labelImage, pImage, iconeImage].forEach(el => el.style.display = "");
  submitButton.style.backgroundColor = "";
}
