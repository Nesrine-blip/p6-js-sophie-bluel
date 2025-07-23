const BASE_API = "http://localhost:5678/api/";


function getApiUrl(route) {
  return `${BASE_API}${route}`;
}

// ===================== DOM ELEMENTS =====================

// Modal containers
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const modalPhoto = document.querySelector('#modal-photo');
const modalClose = document.querySelector('#modal-close');
const modalPhotoClose = document.querySelector("#modal-photo-close");

// Navigation buttons
const newPhotoBtn = document.querySelector('#new-photo');
const returnBtn = document.querySelector('#modal-return');

// Form elements
const titleInput = document.getElementById('modal-photo-title');
const categorySelect = document.getElementById('modal-photo-category');
const imageInput = document.getElementById('image');
const submitButton = document.getElementById('modal-valider');

// Image preview elements
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector("#form-photo-div > p");
const iconeImage = document.querySelector("#iModalImage");

// Gallery container inside modal
const imagesModalContainer = document.querySelector('.gallery-modal');

// ===================== MODAL DISPLAY =====================

function showModal() {
  modal.style.display = 'block';
  loadCategories();
  loadWorks();
}

function hideModal() {
  modal.style.display = 'none';
}

// Prevent closing modal when clicking inside content
[modalContent, modalPhoto].forEach(el => el.addEventListener('click', e => e.stopPropagation()));

// Close modal on click outside or on close buttons
[modal, modalClose, modalPhotoClose].forEach(el => el.addEventListener('click', hideModal));

// ===================== MODAL NAVIGATION =====================

newPhotoBtn.addEventListener('click', () => {
  modalContent.style.display = 'none';
  modalPhoto.style.display = 'block';
});

returnBtn.addEventListener('click', () => {
  modalContent.style.display = 'flex';
  modalPhoto.style.display = 'none';
});

// ===================== LOAD WORKS =====================

function createModalFigure(work) {
  const figure = document.createElement('figure');
  figure.dataset.id = work.id;

  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}" />
    <figcaption>Modifier</figcaption>
    <i class="fa-regular fa-trash-can"></i>
  `;

  figure.querySelector('i').addEventListener('click', e => {
    e.preventDefault();
    deleteWorkById(work.id);
  });

  return figure;
}

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

function deleteWorkById(id) {
  const token = localStorage.getItem("authToken");
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
      document.querySelectorAll(`figure[data-id="${id}"]`).forEach(f => f.remove());
    })
    .catch(() => alert("Échec de la suppression du projet."));
}

// ===================== DELETE ALL WORKS =====================

document.getElementById("delete-gallery").addEventListener("click", () => {
  if (confirm("Supprimer toute la galerie ?")) deleteAllGallery();
});

function deleteAllGallery() {
  const token = localStorage.getItem("authToken");

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

submitButton.addEventListener("click", addNewWork);

function addNewWork(event) {
  event.preventDefault();

  const title = titleInput.value;
  const category = categorySelect.value;
  const image = imageInput.files[0];
  const token = localStorage.getItem("authToken");

  if (!title || !category || !image) {
    return alert("Veuillez remplir tous les champs requis.");
  }

  if (image.size > 4 * 1024 * 1024) {
    return alert("L'image est trop volumineuse. Maximum 4 Mo.");
  }

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
      window.location.reload();
    })
    .catch(err => console.error("Erreur lors de l'ajout du projet", err));
}

// ===================== IMAGE PREVIEW =====================

imageInput.addEventListener("change", () => {
  const image = imageInput.files[0];
  const preview = document.createElement("img");
  preview.src = URL.createObjectURL(image);
  preview.style.maxHeight = "100%";
  preview.style.width = "auto";

  [labelImage, pImage, imageInput, iconeImage].forEach(el => el.style.display = "none");

  document.getElementById("form-photo-div").appendChild(preview);
});

// ===================== BUTTON COLOR ON FORM COMPLETION =====================

function checkFormCompletion() {
  submitButton.style.backgroundColor = (titleInput.value && categorySelect.value && imageInput.value)
    ? '#1D6154'
    : '';
}

[titleInput, categorySelect, imageInput].forEach(el =>
  el.addEventListener('input', checkFormCompletion)
);

// ===================== LOAD CATEGORIES =====================

function loadCategories() {
  fetch(getApiUrl("categories"))
    .then(res => res.json())
    .then(categories => {
      categorySelect.innerHTML = `<option value="" selected disabled>Sélectionnez une catégorie</option>`;
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    })
    .catch(err => console.error("Erreur lors du chargement des catégories", err));
}
