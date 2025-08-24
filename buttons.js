document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.split("/").pop() || "index";
    const buttons = document.querySelectorAll(".headerbtn");
    buttons.forEach(btn => {
        const href = btn.getAttribute("href");
        if (path.startsWith(href)) {
            btn.classList.add("active");
        }
    });
});