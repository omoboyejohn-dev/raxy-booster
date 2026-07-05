import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const email = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const fundWalletBtn = document.getElementById("fundWalletBtn");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderHistoryBtn = document.getElementById("orderHistoryBtn");
const profileBtn = document.getElementById("profileBtn");

// Protect dashboard
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

// Dashboard buttons

fundWalletBtn.addEventListener("click", () => {
    window.location.href = "fund-wallet.html";
});

placeOrderBtn.addEventListener("click", () => {
    window.location.href = "services.html";
});

orderHistoryBtn.addEventListener("click", () => {
    window.location.href = "orders.html";
});

profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
});
