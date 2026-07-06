import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ==============================
// HTML Elements
// ==============================

const ordersList = document.getElementById("ordersList");

// ==============================
// Protect Page
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    loadOrders(user);

});

// ==============================
// Load User Orders
// ==============================

function loadOrders(user) {

    if (!ordersList) return;

    const ordersRef = collection(db, "orders");

    const ordersQuery = query(
        ordersRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    onSnapshot(ordersQuery, (snapshot) => {

        ordersList.innerHTML = "";

        if (snapshot.empty) {

            ordersList.innerHTML = `
                <p style="text-align:center;">
                    You haven't placed any orders yet.
                </p>
            `;

            return;
        }

        snapshot.forEach((docSnap) => {

            const order = docSnap.data();

            const date = order.createdAt
                ? order.createdAt.toDate().toLocaleString()
                : "Just now";

            const card = document.createElement("div");
            card.className = "service-card";

            card.innerHTML = `
                <h3>${order.serviceName || "Unknown Service"}</h3>

                <p><strong>Platform:</strong> ${order.platform || "-"}</p>

                <p><strong>Quantity:</strong> ${order.quantity || 0}</p>

                <p><strong>Price:</strong> ₦${order.price || 0}</p>

                <p><strong>Link:</strong> ${order.link || "-"}</p>

                <p><strong>Status:</strong> ${order.status || "Pending"}</p>

                <p><strong>Date:</strong> ${date}</p>
            `;

            ordersList.appendChild(card);

        });

    }, (error) => {

        console.error(error);

        ordersList.innerHTML = `
            <p style="color:red; text-align:center;">
                ${error.message}
            </p>
        `;

    });

}
