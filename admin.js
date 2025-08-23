import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
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
const chatBox = document.getElementById("chatBox");
const chatName = document.getElementById("chatName");
const chatMessage = document.getElementById("chatMessage");
const sendBtn = document.getElementById("sendBtn");
const chatSound = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
const appSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
onValue(ref(db, "applications"), (snapshot) => {
    appList.innerHTML = "";
    const apps = snapshot.val();
    if (!apps) {
        status.textContent = "No Applications.";
        return;
    }
    const entries = Object.entries(apps).sort((a, b) => a[1].timestamp - b[1].timestamp);
    status.textContent = `There Are ${entries.length} Application(s).`;
    appSound.play();
    entries.forEach(([id, data]) => {
        const div = document.createElement("div");
        div.innerHTML = `<p><b>${data.name}</b> (${data.email})<br>Reason: ${data.reason}</p>`;
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.onclick = async () => {
            await push(ref(db, "members"), { name: data.name, email: data.email });
            await remove(ref(db, "applications/" + id));
            window.location.href = `mailto:${data.email}?subject=Southeast Polk Coding Club Application&body=Hi ${data.name}, your application has been approved! 🎉`;
        };
        const denyBtn = document.createElement("button");
        denyBtn.textContent = "Deny";
        denyBtn.onclick = async () => {
            await remove(ref(db, "applications/" + id));
            window.location.href = `mailto:${data.email}?subject=Southeast Polk Coding Club Application&body=Hi ${data.name}, unfortunately your application has been denied. Thank you for applying.`;
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
sendBtn.onclick = async () => {
    const name = chatName.value.trim();
    const msg = chatMessage.value.trim();
    if (!name || !msg) return;
    await push(ref(db, "chat"), {
        name,
        message: msg,
        timestamp: Date.now()
    });
    chatMessage.value = "";
};
onValue(ref(db, "chat"), (snapshot) => {
    chatBox.innerHTML = "";
    const chats = snapshot.val();
    if (chats) {
        const entries = Object.entries(chats).sort((a, b) => b[1].timestamp - a[1].timestamp);
        chatSound.play();
        entries.forEach(([id, data]) => {
            const div = document.createElement("div");
            const time = new Date(data.timestamp).toLocaleString();
            div.innerHTML = `<b>${data.name}</b> <small>[${time}]</small><br>${data.message}`;
            if (data.name === chatName.value.trim()) {
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.onclick = () => {
                    const newMsg = prompt("Edit your message:", data.message);
                    if (newMsg) {
                        update(ref(db, "chat/" + id), { message: newMsg });
                    }
                };
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.onclick = () => {
                    remove(ref(db, "chat/" + id));
                };
                div.appendChild(document.createElement("br"));
                div.appendChild(editBtn);
                div.appendChild(delBtn);
            }
            div.style.borderBottom = "1px solid #ccc";
            div.style.margin = "10px 0";
            chatBox.appendChild(div);
        });
    }
});