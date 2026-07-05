import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// =============================
// Get Service ID
// =============================

const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

// =============================
// HTML Elements
// =============================

const serviceName = document.getElementById("serviceName");
const servicePlatform = document.getElementById("servicePlatform");
const servicePrice = document.getElementById("servicePrice");

const orderForm = document.getElementById("orderForm");
const orderLink = document.getElementById("orderLink");
const orderQuantity = document.getElementById("orderQuantity");

const submitBtn = orderForm
    ? orderForm.querySelector("button[type='submit']")
    : null;

// =============================
// Variables
// =============================

let currentUser = null;
let currentService = null;

// =============================
// Protect Page
// =============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    currentUser = user;

    if (!serviceId) {
        alert("Invalid service.");
        window.location.replace("dashboard.html");
        return;
    }

    await loadService();

});

// =============================
// Load Service
// =============================

async function loadService() {

    try {

        const serviceRef = doc(db, "services", serviceId);
        const serviceSnap = await getDoc(serviceRef);

        if (!serviceSnap.exists()) {

            alert("Service not found.");
            window.location.replace("dashboard.html");
            return;

        }

        currentService = serviceSnap.data();

        if (serviceName)
            serviceName.textContent = currentService.name;

        if (servicePlatform)
            servicePlatform.textContent = currentService.platform;

        if (servicePrice)
            servicePrice.textContent = `₦${currentService.price}`;

    } catch (error) {

        console.error("Load Service Error:", error);
        alert("Unable to load service.");

    }

}

// =============================
// Place Order
// =============================

if (orderForm) {

    orderForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!currentUser || !currentService) {
            alert("Please wait while the service loads.");
            return;
        }

        const link = orderLink.value.trim();
        const quantity = Number(orderQuantity.value);

        if (!link || isNaN(quantity) || quantity < 1) {
            alert("Please enter a valid link and quantity.");
            return;
        }

        try {

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Placing Order...";
            }

            await addDoc(collection(db, "orders"), {

                userId: currentUser.uid,
                userEmail: currentUser.email,

                serviceId: serviceId,
                serviceName: currentService.name,
                platform: currentService.platform,
                price: Number(currentService.price),

                link: link,
                quantity: quantity,

                status: "Pending",

                createdAt: serverTimestamp()

            });

            alert("Order placed successfully!");

            window.location.replace("dashboard.html");

        } catch (error) {

            console.error("Order Error:", error);

            alert("Failed to place order. Please try again.");

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Place Order";
            }

        }

    });

}
