const urlProjets = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

const zoneGalerie = document.querySelector(".gallery");
const zoneFiltres = document.querySelector(".filters");

let tousLesProjets = [];

async function chargerProjets() {
  const reponse = await fetch(urlProjets);
  return reponse.ok ? await reponse.json() : [];
}

async function chargerCategories() {
  const reponse = await fetch(urlCategories);
  return reponse.ok ? await reponse.json() : [];
}

function afficherProjets(liste) {
  zoneGalerie.innerHTML = "";

  liste.forEach(projet => {
    const bloc = document.createElement("figure");
    const image = document.createElement("img");
    const titre = document.createElement("figcaption");

    image.src = projet.imageUrl;
    image.alt = projet.title;
    titre.innerText = projet.title;

    bloc.appendChild(image);
    bloc.appendChild(titre);
    zoneGalerie.appendChild(bloc);
  });
}

function activerBoutonActif(boutonClique) {
  const tousLesBoutons = document.querySelectorAll(".bouton-filtre");
  tousLesBoutons.forEach(btn => btn.classList.remove("actif"));
  boutonClique.classList.add("actif");
}

function afficherBoutons(categories) {
  const boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";
  boutonTous.classList.add("bouton-filtre", "actif");
  boutonTous.addEventListener("click", () => {
    afficherProjets(tousLesProjets);
    activerBoutonActif(boutonTous);
  });
  zoneFiltres.appendChild(boutonTous);

  categories.forEach(cat => {
    const bouton = document.createElement("button");
    bouton.innerText = cat.name;
    bouton.classList.add("bouton-filtre");
    bouton.addEventListener("click", () => {
      const projetsFiltres = tousLesProjets.filter(p => p.categoryId === cat.id);
      afficherProjets(projetsFiltres);
      activerBoutonActif(bouton);
    });
    zoneFiltres.appendChild(bouton);
  });
}

async function demarrerSite() {
  tousLesProjets = await chargerProjets();
  const categories = await chargerCategories();

  if (tousLesProjets.length > 0 && categories.length > 0) {
    afficherProjets(tousLesProjets);
    afficherBoutons(categories);
  } else {
    console.error("Erreur : impossible de charger les données");
  }
}

demarrerSite();
