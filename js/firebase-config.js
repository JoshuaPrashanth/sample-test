import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwtoGlFS1ndz8kviIt76A9Bvl3QlzY9UI",
  authDomain: "online-complaint-box-4a7a0.firebaseapp.com",
  projectId: "online-complaint-box-4a7a0",
  storageBucket: "online-complaint-box-4a7a0.firebasestorage.app",
  messagingSenderId: "377576195877",
  appId: "1:377576195877:web:c27522766e7ee6920fbccc",
  measurementId: "G-0WKQB7R9G1"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };