import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// If the user is already logged in, go straight to the dashboard
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("dashboard.html");
  }
});

const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Disable the button while logging in
      const button = form.querySelector("button");
      button.disabled = true;
      button.textContent = "Logging in...";

      await signInWithEmailAndPassword(auth, email, password);

      // Redirect immediately (no alert popup)
      window.location.replace("dashboard.html");

    } catch (error) {

      const button = form.querySelector("button");
      button.disabled = false;
      button.textContent = "Login";

      switch (error.code) {
        case "auth/invalid-credential":
          alert("Incorrect email or password.");
          break;

        case "auth/invalid-email":
          alert("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          alert("Too many failed attempts. Please try again later.");
          break;

        default:
          alert(error.message);
      }
    }
  });
}
