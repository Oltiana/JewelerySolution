const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Marrja e vlerave nga inputet
    const emailValue = document.getElementById("email").value.trim();
    const passwordValue = document.getElementById("password").value.trim();

    // Pastrojmë mesazhin e vjetër
    errorMsg.textContent = "";
    errorMsg.style.color = "red";

    // Objekti me fushat boshtë për të kënaqur validimin e serverit (Pika 17 & 19)
    const loginData = {
        Email: emailValue,
        PasswordHash: passwordValue,
        firstName: "", // Mbajmë këto që të mos dalë error-i i kuq
        lastName: "",
        role: ""
    };

    console.log("Sending data to server...", loginData);

    fetch('http://localhost:5176/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            credentials: 'include'
        },
        body: JSON.stringify(loginData)
    })
    .then(async response => {
        if (response.ok) {
            const data = await response.json();
            alert("Login successful!");
            
            // Ruajmë të dhënat në localStorage (Pika 19)
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userName", data.firstName);
            
            // Drejtimi te faqja e produkteve
            window.location.href = "products.html"; 
        } else {
            // Shfaqim vetëm mesazhin e thjeshtë në anglisht
            errorMsg.textContent = "Invalid email or password. Please try again.";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        errorMsg.textContent = "Unable to connect to the server. Please ensure the backend is running.";
    });
});