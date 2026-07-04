import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const referral = document.getElementById("referral").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    alert("🎉 Account created successfully!");

    window.location.href = "login.html";

  } catch (error) {
    alert(error.message);
  }
});
