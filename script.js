document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-to-page2");
    const p1 = document.getElementById("page1");
    const p2 = document.getElementById("page2");

    btn.addEventListener("click", () => {
        // Simple swap logic that never fails
        p1.classList.remove("active");
        
        // Brief timeout ensures CSS transition fires
        setTimeout(() => {
            p1.style.display = "none";
            p2.style.display = "flex";
            
            // Trigger Fade-in for Page 2
            requestAnimationFrame(() => {
                p2.classList.add("active");
            });
        }, 800);
    });
});
