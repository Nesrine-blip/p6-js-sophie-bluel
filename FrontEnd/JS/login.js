// ===================== API URLs =====================

const baseUrl = "http://localhost:5678/api/";
const loginUrl = baseUrl + "users/login";

// ===================== DOM ELEMENT =====================

// Login form
const loginForm = document.getElementById("formulaire-connexion");

// On form submit
loginForm.addEventListener("submit", handleLogin);


// ===================== HANDLE LOGIN =====================

async function handleLogin(event) {
  event.preventDefault(); // Prevent page reload

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("motdepasse");

  // Remove old error message if it exists
  const oldErrorMessage = document.querySelector(".erreur-login");
  if (oldErrorMessage) {
    oldErrorMessage.remove();
  }

  // Check if fields are empty
  if (!emailInput.value || !passwordInput.value) {
    showErrorMessage("Veuillez remplir tous les champs.");
    return;
  }

  // Prepare login data
  const loginData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    // Send login request
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    // If login successful
    if (response.status === 200) {
      const responseData = await response.json();
      localStorage.setItem("authToken", responseData.token);
      window.location.href = "index.html"; // Redirect to homepage
    } else {
      // Wrong email or password
      showErrorMessage("Email ou mot de passe incorrect.");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    showErrorMessage("Erreur technique. Veuillez réessayer.");
  }
}


// ===================== DISPLAY ERROR MESSAGE =====================

// Show error message on top of form
function showErrorMessage(message) {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("erreur-login");
  errorMessage.textContent = message;
  loginForm.prepend(errorMessage);
}
