import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const form = document.getElementById("serviceForm");
const list = document.getElementById("servicesList");

// ADD SERVICE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const platform = document.getElementById("platform").value;
  const price = document.getElementById("price").value;

  await addDoc(collection(db, "services"), {
    name,
    platform,
    price
  });

  alert("Service added!");

  form.reset();
  loadServices();
});

// LOAD SERVICES
async function loadServices() {
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "services"));

  snapshot.forEach((item) => {
    const data = item.data();

    const div = document.createElement("div");

    div.innerHTML = `
      <p>
        <b>${data.name}</b> - ${data.platform} - ₦${data.price}
        <button onclick="deleteService('${item.id}')">Delete</button>
      </p>
    `;

    list.appendChild(div);
  });
}

// DELETE SERVICE
window.deleteService = async (id) => {
  await deleteDoc(doc(db, "services", id));
  loadServices();
};

// INITIAL LOAD
loadServices();
