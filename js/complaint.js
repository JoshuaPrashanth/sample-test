import { auth, db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const complaintForm = document.getElementById("complaintForm");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");

  let messageDiv = document.querySelector(".form-message");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.className = "form-message";
    complaintForm.parentNode.insertBefore(messageDiv, complaintForm);
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../index.html";
    }
  });

  if (complaintForm) {
    complaintForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const description = descInput.value.trim();

      if (!title || !description) {
        showMessage("Please fill in both fields", "error");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        showMessage("You must be logged in", "error");
        return;
      }

      const submitBtn = complaintForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      try {
        await addDoc(collection(db, "complaints"), {
          userId: user.uid,
          title: title,
          description: description,
          status: "pending",
          createdAt: serverTimestamp()
        });

        showMessage("Complaint submitted successfully!", "success");
        complaintForm.reset();

        setTimeout(() => {
          window.location.href = "student-dashboard.html";
        }, 1500);

      } catch (error) {
        console.error("Submission Error:", error.message);
        showMessage(error.message, "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Complaint";
      }
    });
  }

  function showMessage(text, type) {
    let messageDiv = document.querySelector(".form-message");
    if (!messageDiv) {
      messageDiv = document.createElement("div");
      messageDiv.className = "form-message";
      complaintForm.parentNode.insertBefore(messageDiv, complaintForm);
    }
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = "block";

    if (type === "success") {
      setTimeout(() => {
        messageDiv.style.display = "none";
      }, 3000);
    }
  }
});