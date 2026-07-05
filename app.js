import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("dashboard.html");
  }
});

const form = document.getElementById("registerForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Creating Account...";

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // Redirect immediately
      window.location.replace("dashboard.html");

    } catch (error) {

      button.disabled = false;
      button.textContent = "Create Account";

      switch (error.code) {
        case "auth/email-already-in-use":
          alert("This email is already registered.");
          break;

        case "auth/invalid-email":
          alert("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          alert("Password must be at least 6 characters.");
          break;

        default:
          alert(error.message);
      }
    }
  });
}
