import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  collection, getDocs, orderBy, query, where,
  doc, updateDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const complaintsGrid = document.getElementById("complaintsList");

  const confirmModal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const cancelConfirm = document.getElementById("cancelConfirm");
  const confirmAction = document.getElementById("confirmAction");

  let pendingAction = null;

  cancelConfirm.addEventListener("click", () => {
    confirmModal.classList.remove("show");
    pendingAction = null;
  });

  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
      confirmModal.classList.remove("show");
      pendingAction = null;
    }
  });

  confirmAction.addEventListener("click", async () => {
    if (!pendingAction) return;
    const { complaintId, newStatus, card } = pendingAction;

    try {
      await updateDoc(doc(db, "complaints", complaintId), { status: newStatus });
      card.remove();
      if (complaintsGrid.children.length === 0) {
        complaintsGrid.innerHTML = '<div class="empty-state">No pending complaints.</div>';
      }
      confirmModal.classList.remove("show");
      pendingAction = null;
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update status.");
      confirmModal.classList.remove("show");
      pendingAction = null;
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
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        alert("Access denied. Admins only.");
        await signOut(auth);
        window.location.href = "../index.html";
        return;
      }

      complaintsGrid.innerHTML = '<div class="loading-state">Loading pending complaints...</div>';

      const q = query(
        collection(db, "complaints"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        complaintsGrid.innerHTML = '<div class="empty-state">No pending complaints.</div>';
        return;
      }

      complaintsGrid.innerHTML = "";

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const complaintId = docSnap.id;
        const statusClass = getStatusClass(data.status);

        let studentName = "Unknown", studentPhone = "N/A";
        if (data.userId) {
          const userSnap = await getDoc(doc(db, "users", data.userId));
          if (userSnap.exists()) {
            studentName = userSnap.data().name || "Unknown";
            studentPhone = userSnap.data().phone || "N/A";
          }
        }

        const card = document.createElement("div");
        card.className = "complaint-card";
        card.setAttribute("data-id", complaintId);
        card.innerHTML = `
          <h3 class="complaint-title">${data.title}</h3>
          <p class="complaint-description">${data.description}</p>
          <span class="status-badge ${statusClass}">
            <span>●</span> ${data.status || 'Pending'}
          </span>
          <div class="complaint-meta">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Phone:</strong> ${studentPhone}</p>
          </div>
          <div class="card-actions">
            <button class="btn-resolve">Resolve</button>
            <button class="btn-reject">Reject</button>
          </div>
        `;

        card.querySelector(".btn-resolve").addEventListener("click", () => {
          modalTitle.textContent = "Resolve Complaint";
          modalMessage.textContent = "Mark this complaint as resolved? It will be removed from the admin panel.";
          confirmAction.style.background = "#10b981";
          confirmAction.textContent = "Resolve";
          pendingAction = { complaintId, newStatus: "resolved", card };
          confirmModal.classList.add("show");
        });

        card.querySelector(".btn-reject").addEventListener("click", () => {
          modalTitle.textContent = "Reject Complaint";
          modalMessage.textContent = "Reject this complaint? It will be removed from the admin panel.";
          confirmAction.style.background = "#ef4444";
          confirmAction.textContent = "Reject";
          pendingAction = { complaintId, newStatus: "rejected", card };
          confirmModal.classList.add("show");
        });

        complaintsGrid.appendChild(card);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        complaintsGrid.innerHTML = '<div class="empty-state">Database index required. Please create the index as per instructions.</div>';
      } else {
        complaintsGrid.innerHTML = '<div class="empty-state">Error loading complaints. Please refresh or check console.</div>';
      }
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Logout Error:", error);
      }
    });
  }
});