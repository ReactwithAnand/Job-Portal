import { API_BASE_URL } from "../../../constants/constant.js";

// ─── Navigation ───────────────────────────────────────────────────────────────

function navigate(fromId, toId) {
  document.getElementById(fromId).classList.remove("active");
  document.getElementById(toId).classList.add("active");
}

// ─── Show/Hide error messages ─────────────────────────────────────────────────

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.style.display = "block";
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  el.textContent = "";
  el.style.display = "none";
}

// ─── Password Visibility Toggle ───────────────────────────────────────────────

document.getElementById("show-password-toggle").addEventListener("change", function () {
  const type = this.checked ? "text" : "password";
  document.getElementById("new-password").type = type;
  document.getElementById("confirm-password").type = type;
});

// ─── Navigation Buttons ───────────────────────────────────────────────────────

document.getElementById("go-to-create").addEventListener("click", () => {
  navigate("step-signin", "step-create-account");
});

document.getElementById("back-to-signin").addEventListener("click", () => {
  navigate("step-create-account", "step-signin");
});

document.getElementById("go-to-password").addEventListener("click", () => {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();

  if (!name || !email) {
    alert("Please fill in all fields.");
    return;
  }

  navigate("step-create-account", "step-password");
});

document.getElementById("back-to-create").addEventListener("click", () => {
  navigate("step-password", "step-create-account");
});

// ─── Login ────────────────────────────────────────────────────────────────────

document.getElementById("signin-btn").addEventListener("click", async () => {
  hideError("signin-error");

  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;

  if (!email || !password) {
    showError("signin-error", "Email and password are required.");
    return;
  }

  const btn = document.getElementById("signin-btn");
  btn.disabled = true;
  btn.textContent = "Signing in...";

  try {
    const response = await fetch(`${API_BASE_URL}/companies/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // needed to receive cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError("signin-error", data.message || "Login failed. Please try again.");
      return;
    }

    // Login successful — redirect or handle as needed
    console.log("Logged in:", data);
    window.location.href = "../../profile/profile.html"; // change to your actual redirect path

  } catch (err) {
    showError("signin-error", "Network error. Please try again.");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Next";
  }
});

// ─── Register ─────────────────────────────────────────────────────────────────

document.getElementById("register-btn").addEventListener("click", async () => {
  hideError("register-error");

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!password || !confirmPassword) {
    showError("register-error", "Please fill in both password fields.");
    return;
  }

  if (password !== confirmPassword) {
    showError("register-error", "Passwords do not match.");
    return;
  }

  const btn = document.getElementById("register-btn");
  btn.disabled = true;
  btn.textContent = "Creating account...";

  try {
    const response = await fetch(`${API_BASE_URL}/companies/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError("register-error", data.message || "Registration failed. Please try again.");
      return;
    }

    // Registration successful — go back to sign in
    alert("Account created successfully! Please sign in.");
    navigate("step-password", "step-signin");

    // Clear register fields
    document.getElementById("register-name").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";

  } catch (err) {
    showError("register-error", "Network error. Please try again.");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Next";
  }
});