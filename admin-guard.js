import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const ADMIN_EMAIL = "raxysocial365@gmail.com";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    if (user.email !== ADMIN_EMAIL) {
      alert("Access denied: Admin only");
      window.location.href = "dashboard.html";
    }
  }
});
