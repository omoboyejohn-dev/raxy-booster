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

// Protect Dashboard
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    if (email) {
        email.textContent = user.email;
    }

    loadServices();

});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {

        try {
            await signOut(auth);
            window.location.replace("login.html");
        } catch (error) {
            console.error(error);
            alert("Logout failed.");
        }

    });
}

// Dashboard Buttons
if (fundWalletBtn) {
    fundWalletBtn.addEventListener("click", () => {
        window.location.href = "fund-wallet.html";
    });
}

if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
        window.location.href = "services.html";
    });
}

if (orderHistoryBtn) {
    orderHistoryBtn.addEventListener("click", () => {
        window.location.href = "orders.html";
    });
}

if (profileBtn) {
    profileBtn.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

// ==========================
// Load Services
// ==========================

function loadServices() {

    if (!servicesList) return;

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

            const card = document.createElement("div");
            card.className = "service-card";

            card.innerHTML = `
                <h3>${service.name}</h3>

                <p><strong>Platform:</strong> ${service.platform}</p>

                <p><strong>Price:</strong> ₦${service.price}</p>

                <button class="btn-primary order-btn" data-id="${doc.id}">
                    Order Now
                </button>
            `;

            card.querySelector(".order-btn").addEventListener("click", () => {
                window.location.href = `order.html?id=${doc.id}`;
            });

            servicesList.appendChild(card);

        });

    }, (error) => {
        console.error(error);

        servicesList.innerHTML = `
            <p style="color:red;text-align:center;">
                Failed to load services.
            </p>
        `;
    });

}
