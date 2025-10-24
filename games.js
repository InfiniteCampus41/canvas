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
const container = document.getElementById("gamesContainer");
const approvedRef = ref(db, "approved");
onValue(approvedRef, (snapshot) => {
    const data = snapshot.val();
    container.innerHTML = "";
    if (data) {
        const games = Object.values(data);
        games.sort((a, b) => a.gameName.localeCompare(b.gameName));
        games.forEach((game) => {
            const button = document.createElement("button");
            button.textContent = game.gameName;
            button.className = "button";
            button.onclick = () => {
                container.style.display = "none";
                const backButton = document.createElement("button");
                backButton.textContent = "← Back";
                backButton.className = "button";
                backButton.style.position = "fixed";
                backButton.style.top = "10px";
                backButton.style.left = "10px";
                backButton.style.marginLeft = "70px";
                backButton.style.zIndex = "1000";
                const iframe = document.createElement("object");
                iframe.setAttribute("type", "text/html");
                iframe.setAttribute("data", game.gameUrl);
                iframe.style.width = "calc( 100vw - 60px)";
                iframe.style.height = "90%";
                iframe.style.marginLeft = "60px";
                const topBar = document.querySelectorAll('.topBar');
                topBar.forEach(el => {
                  el.style.display = 'none';
                });
                document.body.appendChild(backButton);
                document.body.appendChild(iframe);
                backButton.onclick = () => {
                    iframe.remove();
                    backButton.remove();
                    container.style.display = "flex";
                };
            };
            container.appendChild(button);
        });
    }
});
