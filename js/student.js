import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  collection, query, where, getDocs, orderBy, 
  deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const complaintsGrid = document.getElementById("complaintsList");

  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");
  const editTitle = document.getElementById("editTitle");
  const editDescription = document.getElementById("editDescription");
  const cancelEdit = document.getElementById("cancelEdit");

  const deleteModal = document.getElementById("deleteModal");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");

  let currentComplaintId = null;
  let currentDeleteId = null;

  cancelEdit.addEventListener("click", () => {
    editModal.classList.remove("show");
    currentComplaintId = null;
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.classList.remove("show");
      currentComplaintId = null;
    }
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentComplaintId) return;

    const newTitle = editTitle.value.trim();
    const newDesc = editDescription.value.trim();

    if (!newTitle || !newDesc) {
      alert("Both fields are required");
      return;
    }

    try {
      await updateDoc(doc(db, "complaints", currentComplaintId), {
        title: newTitle,
        description: newDesc
      });

      const card = document.querySelector(`.complaint-card[data-id="${currentComplaintId}"]`);
      if (card) {
        card.querySelector(".complaint-title").textContent = newTitle;
        card.querySelector(".complaint-description").textContent = newDesc;
      }

      editModal.classList.remove("show");
      currentComplaintId = null;
      editForm.reset();
    } catch (error) {
      console.error("Update Error:", error.message);
      alert("Failed to update complaint.");
    }
  });

  cancelDelete.addEventListener("click", () => {
    deleteModal.classList.remove("show");
    currentDeleteId = null;
  });

  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.remove("show");
      currentDeleteId = null;
    }
  });

  confirmDelete.addEventListener("click", async () => {
    if (!currentDeleteId) return;

    try {
      await deleteDoc(doc(db, "complaints", currentDeleteId));
      
      const card = document.querySelector(`.complaint-card[data-id="${currentDeleteId}"]`);
      if (card) card.remove();

      if (complaintsGrid.children.length === 0) {
        complaintsGrid.innerHTML = '<div class="empty-state">No complaints found.</div>';
      }

      deleteModal.classList.remove("show");
      currentDeleteId = null;
    } catch (error) {
      console.error("Delete Error:", error.message);
      alert("Failed to delete complaint.");
      deleteModal.classList.remove("show");
      currentDeleteId = null;
    }
  });

  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'resolved': return 'status-resolved';
      case 'rejected': return 'status-rejected';
      case 'in progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "../index.html";
      return;
    }

    try {
      complaintsGrid.innerHTML = '<div class="loading-state">Loading your complaints...</div>';

      const q = query(
        collection(db, "complaints"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        complaintsGrid.innerHTML = '<div class="empty-state">No complaints found. Click "New Complaint" to get started.</div>';
        return;
      }

      complaintsGrid.innerHTML = "";

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const statusClass = getStatusClass(data.status);
        const complaintId = docSnap.id;
        const isPending = data.status?.toLowerCase() === 'pending';

        const card = document.createElement("div");
        card.className = "complaint-card";
        card.setAttribute("data-id", complaintId);
        card.innerHTML = `
          <h3 class="complaint-title">${data.title}</h3>
          <p class="complaint-description">${data.description}</p>
          <span class="status-badge ${statusClass}">
            <span>●</span> ${data.status || 'Pending'}
          </span>
          <div class="card-actions">
            ${isPending ? '<button class="edit-btn">Edit</button>' : ''}
            <button class="delete-btn">Delete</button>
          </div>
        `;

        card.querySelector(".delete-btn").addEventListener("click", () => {
          currentDeleteId = complaintId;
          deleteModal.classList.add("show");
        });

        if (isPending) {
          card.querySelector(".edit-btn").addEventListener("click", () => {
            currentComplaintId = complaintId;
            editTitle.value = data.title;
            editDescription.value = data.description;
            editModal.classList.add("show");
          });
        }

        complaintsGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Fetch Error:", error.message);
      complaintsGrid.innerHTML = '<div class="empty-state">Error loading complaints. Please refresh.</div>';
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Logout Error:", error.message);
      }
    });
  }
});