import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, remove, push, set, query, orderByChild } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
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
const appsRef = query(ref(db, "applications"), orderByChild("timestamp"));
const container = document.getElementById("applications");
onChildAdded(appsRef, (snapshot) => {
    const appData = snapshot.val();
    const appKey = snapshot.key;
    const div = document.createElement("div");
    div.style.border = "7px solid black";
    div.style.borderRadius = "20px"
    div.style.margin = "10px";
    div.style.padding = "10px";
    div.innerHTML = `
        <p><b>Name:</b><br> ${appData.name}</p>
        <p><b>Email:</b><br> ${appData.email}</p>
        <p><a class="button" href="${appData.gameUrl}" target="_blank">${appData.gameName}</a></p>
        <button class="button" >Approve</button>
        <button class="button" >Deny</button>
    `;
    const [approveBtn, denyBtn] = div.querySelectorAll("button");
    approveBtn.onclick = async () => {
        const approvedRef = push(ref(db, "approved"));
        await set(approvedRef, {
            name: appData.name,
            email: appData.email,
            gameName: appData.gameName,
            gameUrl: appData.gameUrl,
            timestamp: Date.now()
        });
        await remove(ref(db, "applications/" + appKey));
        div.remove();
    };
    denyBtn.onclick = async () => {
        await remove(ref(db, "applications/" + appKey));
        div.remove();
    };
    container.prepend(div);
});