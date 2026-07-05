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

const ordersList = document.getElementById("ordersList");

// Protect page
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    loadOrders(user);

});

function loadOrders(user) {

    const ordersRef = collection(db, "orders");

    const q = query(
        ordersRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {

        ordersList.innerHTML = "";

        if (snapshot.empty) {

            ordersList.innerHTML = `
                <p style="text-align:center;">
                    You haven't placed any orders yet.
                </p>
            `;

            return;
        }

        snapshot.forEach((doc) => {

            const order = doc.data();

            let date = "Just now";

            if (order.createdAt) {
                date = order.createdAt.toDate().toLocaleString();
            }

            ordersList.innerHTML += `

                <div class="service-card">

                    <h3>${order.serviceName}</h3>

                    <p><strong>Platform:</strong> ${order.platform}</p>

                    <p><strong>Quantity:</strong> ${order.quantity}</p>

                    <p><strong>Price:</strong> ₦${order.price}</p>

                    <p><strong>Link:</strong> ${order.link}</p>

                    <p><strong>Status:</strong> ${order.status}</p>

                    <p><strong>Date:</strong> ${date}</p>

                </div>

            `;

        });

    }, (error) => {

        console.error(error);

        ordersList.innerHTML = `
            <p style="color:red;text-align:center;">
                Failed to load orders.
            </p>
        `;

    });

}
