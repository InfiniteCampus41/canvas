import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
    getDatabase, ref, push, get, query, orderByChild, equalTo 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyDMj318tH4QzLvK-HSh8v8qobVnxM0Lmns",
    authDomain: "discord-bot-5d5b1.firebaseapp.com",
    databaseURL: "https://discord-bot-5d5b1-default-rtdb.firebaseio.com", 
    projectId: "discord-bot-5d5b1",
    storageBucket: "discord-bot-5d5b1.firebasestorage.app",
    messagingSenderId: "300539295561",
    appId: "1:300539295561:web:d0fd8d48f48fcc94764c98",
    measurementId: "G-RTS81NC93R"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const form = document.getElementById("applyForm");
const msg = document.getElementById("message");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const reason = document.getElementById("reason").value.trim();
    const email = document.getElementById("email").value.trim();
    try {
        const emailQuery = query(ref(db, "applications"), orderByChild("email"), equalTo(email));
        const snapshot = await get(emailQuery);
        if (snapshot.exists()) {
            msg.textContent = "This Email Has Already Applied.";
            return;
        }
        await push(ref(db, "applications"), {
            name,
            reason,
            email,
            timestamp: Date.now()
        });
        msg.textContent = "Thank You For Applying, You May Now Close This Tab";
        form.style.display = "none";
    } catch (err) {
        console.error("Error Submitting Application:", err);
        msg.textContent = "Error Submitting Application.";
    }
});