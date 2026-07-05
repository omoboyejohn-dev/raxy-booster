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

const form = document.getElementById("serviceForm");
const list = document.getElementById("servicesList");
const logoutBtn = document.getElementById("logoutBtn");

// ===============================
// LOAD SERVICES
// ===============================
async function loadServices() {
  list.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "services"));

    if (snapshot.empty) {
      list.innerHTML = "<p>No services available.</p>";
      return;
    }

    snapshot.forEach((item) => {
      const data = item.data();

      const div = document.createElement("div");

      div.innerHTML = `
        <div style="border:1px solid #ddd;padding:10px;margin-bottom:10px;border-radius:8px;">
          <h3>${data.name}</h3>
          <p><strong>Platform:</strong> ${data.platform}</p>
          <p><strong>Price:</strong> ₦${data.price}</p>
          <button onclick="deleteService('${item.id}')">
            Delete
          </button>
        </div>
      `;

      list.appendChild(div);
    });

  } catch (error) {
    alert(error.message);
  }
}

// ===============================
// ADD SERVICE
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {

    const name = document.getElementById("name").value.trim();
    const platform = document.getElementById("platform").value.trim();
    const price = Number(document.getElementById("price").value);

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

// ===============================
// DELETE SERVICE
// ===============================
window.deleteService = async (id) => {

  if (!confirm("Delete this service?")) return;

  try {

    await deleteDoc(doc(db, "services", id));

    loadServices();

  } catch (error) {
    alert(error.message);
  }
};

// ===============================
// LOGOUT
// ===============================
logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }

});

// ===============================
// START
// ===============================
loadServices();
