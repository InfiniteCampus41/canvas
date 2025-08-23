import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
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
const table = document.getElementById("memberTable");
const memberCount = document.getElementById("memberCount");
onValue(ref(db, "members"), (snapshot) => {
    while (table.rows.length > 6) table.deleteRow(3);
    let count = 5;
    const data = snapshot.val();
    if (data) {
        Object.values(data).forEach(member => {
            const row = table.insertRow();
            row.insertCell(0).textContent = member.name;
            row.insertCell(1).textContent = member.email;
            count++;
        });
    }
    memberCount.textContent = count;
});