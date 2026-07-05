import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const email = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

// Protect the page
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    email.textContent = user.email;

});

// Logout
logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.replace("login.html");

});
