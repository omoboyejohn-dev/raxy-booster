import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const servicesGrid = document.querySelector(".services-grid");

const servicesRef = collection(db, "services");

onSnapshot(servicesRef, (snapshot) => {

    servicesGrid.innerHTML = "";

    if (snapshot.empty) {

        servicesGrid.innerHTML = `
            <div class="service-card">
                <h2>No Services Available</h2>
                <p>Please check back later.</p>
            </div>
        `;

        return;
    }

    snapshot.forEach((doc) => {

        const service = doc.data();

        const card = document.createElement("div");

        card.className = "service-card";

        card.innerHTML = `
            <h2>${service.icon || "🚀"} ${service.name}</h2>

            <p>${service.description}</p>

            <p><strong>Price:</strong> ₦${service.price}</p>

            <button class="btn-primary">
                Order Now
            </button>
        `;

        card.querySelector("button").addEventListener("click", () => {

            window.location.href = `order.html?id=${doc.id}`;

        });

        servicesGrid.appendChild(card);

    });

}, (error) => {

    console.error(error);

    servicesGrid.innerHTML = `
        <div class="service-card">
            <h2>Error</h2>
            <p>Failed to load services.</p>
        </div>
    `;

});
