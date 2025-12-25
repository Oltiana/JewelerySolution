const signupForm = document.getElementById("signupForm");
const errorMsg = document.getElementById("errorMsg");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (errorMsg) errorMsg.textContent = "";

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            if (errorMsg) errorMsg.textContent = "All fields are required.";
            return;
        }

        if (password.length < 6) {
            if (errorMsg) errorMsg.textContent = "Password must be at least 6 characters long.";
            return;
        }

        if (password !== confirmPassword) {
            if (errorMsg) errorMsg.textContent = "Passwords do not match.";
            return;
        }

        alert("Sign Up successful! Welcome, " + firstName + "!");
        window.location.href = "login.html";
    });
}