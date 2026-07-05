import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Get service ID from URL
const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

// HTML Elements
const serviceName = document.getElementById("serviceName");
const servicePlatform = document.getElementById("servicePlatform");
const servicePrice = document.getElementById("servicePrice");

const orderForm = document.getElementById("orderForm");
const orderLink = document.getElementById("orderLink");
const orderQuantity = document.getElementById("orderQuantity");

let currentUser = null;
let currentService = null;

// Protect page
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    currentUser = user;

    if (!serviceId) {
        alert("Service not found.");
        window.location.replace("dashboard.html");
        return;
    }

    await loadService();

});

// Load selected service
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

        serviceName.textContent = currentService.name;
        servicePlatform.textContent = currentService.platform;
        servicePrice.textContent = `₦${currentService.price}`;

    } catch (error) {

        console.error(error);
        alert("Failed to load service.");

    }

}

// Place Order
orderForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const link = orderLink.value.trim();
    const quantity = Number(orderQuantity.value);

    if (!link || quantity <= 0) {
        alert("Please complete all fields.");
        return;
    }

    try {

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

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);
        alert("Failed to place order.");

    }

});
