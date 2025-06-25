// 1. Appel à l'API pour récupérer les projets
fetch("http://localhost:5678/api/works")
  .then(response => response.json()) // 2. Transformer la réponse en JSON
  .then(works => {
    const gallery = document.querySelector(".gallery"); // 3. Cibler la galerie

    // 4. Parcourir les projets reçus
    works.forEach(work => {
      // Créer une balise <figure>
      const figure = document.createElement("figure");

      // Créer une balise <img>
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      // Créer une balise <figcaption>
      const caption = document.createElement("figcaption");
      caption.innerText = work.title;

      // Ajouter l’image et le texte dans la figure
      figure.appendChild(img);
      figure.appendChild(caption);

      // Ajouter la figure dans la galerie
      gallery.appendChild(figure);
    });
  })
  .catch(error => {
    console.error("Erreur lors du fetch :", error);
  });
