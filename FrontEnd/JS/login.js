// ===================== API URLs =====================
const baseUrl = "http://localhost:5678/api/";
const loginUrl = baseUrl + "users/login";

// ===================== DOM ELEMENTS =====================
// Login form element
const loginForm = document.getElementById("formulaire-connexion");

// Add event listener when the form is submitted
loginForm.addEventListener("submit", handleLogin);

// ===================== HANDLE LOGIN =====================
async function handleLogin(event) {
  event.preventDefault(); // Stop page from refreshing

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("motdepasse");

  // Remove previous error message (if any)
  const oldErrorMessage = document.querySelector(".erreur-login");
  if (oldErrorMessage) {
    oldErrorMessage.remove();
  }

  // Check if fields are empty
  if (!emailInput.value || !passwordInput.value) {
    showErrorMessage("Veuillez remplir tous les champs.");
    return;
  }

  // Create login object
  const loginData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    // Send request to API
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    // Success: user is authenticated
    if (response.status === 200) {
      const responseData = await response.json();

      // Save token and redirect
      sessionStorage.setItem("authToken", responseData.token);
      window.location.href = "index.html";
    } else {
      // If credentials are incorrect
      showErrorMessage("Email ou mot de passe incorrect.");
    }

  } catch (error) {
    // If there is a technical error
    console.error("Erreur lors de la connexion :", error);
    showErrorMessage("Erreur technique. Veuillez réessayer.");
  }
}

// ===================== DISPLAY ERROR MESSAGE =====================
// Show error message at top of form
function showErrorMessage(message) {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("erreur-login");
  errorMessage.textContent = message;
  loginForm.prepend(errorMessage);
}
