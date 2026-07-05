import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Elements
const form = document.getElementById("serviceForm");
const list = document.getElementById("servicesList");
const logoutBtn = document.getElementById("logoutBtn");

// ===============================
// LOAD SERVICES
// ===============================
async function loadServices() {

  if (!list) return;

  list.innerHTML = "<p>Loading services...</p>";

  try {

    const snapshot = await getDocs(collection(db, "services"));

    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "<p>No services available.</p>";
      return;
    }

    snapshot.forEach((item) => {

      const data = item.data();

      const card = document.createElement("div");

      card.className = "service-card";

      card.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Platform:</strong> ${data.platform}</p>
        <p><strong>Price:</strong> ₦${data.price}</p>

        <button class="delete-btn" data-id="${item.id}">
          Delete
        </button>

        <hr>
      `;

      list.appendChild(card);
    });

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {

      button.addEventListener("click", async () => {

        const id = button.dataset.id;

        if (!confirm("Delete this service?")) return;

        try {

          await deleteDoc(doc(db, "services", id));

          alert("Service deleted.");

          loadServices();

        } catch (error) {

          alert(error.message);

        }

      });

    });

  } catch (error) {

    list.innerHTML = "<p>Failed to load services.</p>";

    alert(error.message);

  }

}

// ===============================
// ADD SERVICE
// ===============================
if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

      const name = document.getElementById("name").value.trim();
      const platform = document.getElementById("platform").value.trim();
      const price = Number(document.getElementById("price").value);

      if (!name || !platform || !price) {
        alert("Please fill in all fields.");
        return;
      }

      await addDoc(collection(db, "services"), {
        name,
        platform,
        price
      });

      alert("Service added successfully!");

      form.reset();

      loadServices();

    } catch (error) {

      alert(error.message);

    }

  });

}

// ===============================
// LOGOUT
// ===============================
if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      window.location.href = "login.html";

    } catch (error) {

      alert(error.message);

    }

  });

}

// ===============================
// START
// ===============================
loadServices();
