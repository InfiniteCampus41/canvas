import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
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
const appList = document.getElementById("appList");
const status = document.getElementById("status");
const approvedList = document.getElementById("approvedList");
onValue(ref(db, "applications"), (snapshot) => {
    appList.innerHTML = "";
    const apps = snapshot.val();
    if (!apps) {
        status.textContent = "No Applications.";
        return;
    }
    const entries = Object.entries(apps).sort((a, b) => a[1].timestamp - b[1].timestamp);
    status.textContent = `There Are ${entries.length} Application(s).`;
    entries.forEach(([id, data]) => {
        const div = document.createElement("div");
        div.innerHTML = `<p><b>${data.name}</b> (${data.email})<br>Reason: ${data.reason}</p>`;
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.onclick = async () => {
            await push(ref(db, "members"), { name: data.name, email: data.email });
            await remove(ref(db, "applications/" + id));
            window.location.href = `mailto:${data.email}?subject=Southeast Polk Video Game Club Application&body=Hi ${data.name}, your application has been approved! 🎉`;
        };
        const denyBtn = document.createElement("button");
        denyBtn.textContent = "Deny";
        denyBtn.onclick = async () => {
            await remove(ref(db, "applications/" + id));
            window.location.href = `mailto:${data.email}?subject=Southeast Polk Video Game Club Application&body=Hi ${data.name}, unfortunately your application has been denied. Thank you for applying.`;
        };
        div.appendChild(approveBtn);
        div.appendChild(denyBtn);
        appList.appendChild(div);
        appList.appendChild(document.createElement("hr"));
    });
});
onValue(ref(db, "members"), (snapshot) => {
    approvedList.innerHTML = "";
    const members = snapshot.val();
    if (members) {
        Object.values(members).forEach(m => {
            const li = document.createElement("li");
            li.textContent = `${m.name} (${m.email})`;
            approvedList.appendChild(li);
        });
    }
});