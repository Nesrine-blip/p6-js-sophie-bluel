const urlBase = "http://localhost:5678/api/";
const loginApiUrl = urlBase + "users/login";

const formulaireConnexion = document.getElementById("formulaire-connexion");

formulaireConnexion.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("motdepasse");

  const ancienMessageErreur = document.querySelector(".erreur-login");
  if (ancienMessageErreur) {
    ancienMessageErreur.remove();
  }

  if (!emailInput.value || !passwordInput.value) {
    afficherMessageErreur("Veuillez remplir tous les champs.");
    return;
  }

  const loginData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const response = await fetch(loginApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.status === 200) {
      const loginResponse = await response.json();
      localStorage.setItem("authToken", loginResponse.token);
      window.location.href = "index.html";
    } else {
      afficherMessageErreur("Email ou mot de passe incorrect.");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    afficherMessageErreur("Erreur technique. Veuillez réessayer.");
  }
  
}

function afficherMessageErreur(message) {
  const messageErreur = document.createElement("p");
  messageErreur.classList.add("erreur-login");
  messageErreur.textContent = message;
  formulaireConnexion.prepend(messageErreur);
}
