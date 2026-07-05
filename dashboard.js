import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const email = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const fundWalletBtn = document.getElementById("fundWalletBtn");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderHistoryBtn = document.getElementById("orderHistoryBtn");
const profileBtn = document.getElementById("profileBtn");

const servicesList = document.getElementById("servicesList");

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


// =============================
// Load Services from Firestore
// =============================

const servicesRef = collection(db, "services");

onSnapshot(servicesRef, (snapshot) => {

    servicesList.innerHTML = "";

    if (snapshot.empty) {

        servicesList.innerHTML = `
            <p style="text-align:center;">
                No services available.
            </p>
        `;

        return;
    }

    snapshot.forEach((doc) => {

        const service = doc.data();

        servicesList.innerHTML += `

            <div class="service-card">

                <h3>${service.name}</h3>

                <p><strong>Platform:</strong> ${service.platform}</p>

                <p><strong>Price:</strong> ₦${service.price}</p>

                <button
                    class="btn-primary order-btn"
                    data-id="${doc.id}">
                    Order Now
                </button>

            </div>

        `;

    });

    document.querySelectorAll(".order-btn").forEach((button) => {

        button.addEventListener("click", () => {

            const serviceId = button.dataset.id;

            window.location.href =
                `order.html?id=${serviceId}`;

        });

    });

});
