import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("registerModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  if (modal) {
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => {
        modal.classList.remove("show");
      });
    }
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  function showModal(title, message) {
    if (modal && modalTitle && modalMessage) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modal.classList.add("show");
    } else {
      alert(`${title}: ${message}`);
    }
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const phone = document.getElementById("phone").value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          phone,
          role: "student"
        });

        showModal("Success", "Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        console.error("Registration error:", error);
        let friendlyMessage = error.message;

        if (error.code === "auth/email-already-in-use") {
          friendlyMessage = "This email is already registered. Please use a different email.";
        } else if (error.code === "auth/weak-password") {
          friendlyMessage = "Password should be at least 6 characters.";
        } else if (error.code === "auth/invalid-email") {
          friendlyMessage = "Please enter a valid email address.";
        }

        showModal("Registration Failed", friendlyMessage);
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const errorDiv = document.getElementById("loginError");
    const errorTextSpan = errorDiv ? errorDiv.querySelector(".error-text") : null;

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (errorDiv) errorDiv.classList.remove("show");

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.role === "admin") {
            window.location.href = "pages/admin-dashboard.html";
          } else {
            window.location.href = "pages/student-dashboard.html";
          }
        } else {
          if (errorTextSpan) errorTextSpan.textContent = "User data not found!";
          if (errorDiv) errorDiv.classList.add("show");
        }
      } catch (error) {
        console.error("Login error:", error);
        let friendlyMessage = "Invalid email or password";

        if (error.code === "auth/user-not-found") {
          friendlyMessage = "No account found with this email";
        } else if (error.code === "auth/wrong-password") {
          friendlyMessage = "Incorrect password";
        } else if (error.code === "auth/too-many-requests") {
          friendlyMessage = "Too many failed attempts. Try again later.";
        }

        if (errorTextSpan) errorTextSpan.textContent = friendlyMessage;
        if (errorDiv) errorDiv.classList.add("show");
      }
    });
  }
});