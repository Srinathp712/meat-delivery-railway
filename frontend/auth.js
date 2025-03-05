document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.href = "dashboard.html";  // Redirect after login
            }
        });
    }

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";  // Redirect after successful registration
            }
        });
    }
});
