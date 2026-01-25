const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

(async () => {
   const user = await getUser();
   if (user?.isAuthenticated) {
   window.location.href = '/home.html';
   }
})();

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Marrja e vlerave nga inputet
    const emailValue = document.getElementById("email").value.trim();
    const passwordValue = document.getElementById("password").value.trim();

    // Pastrojmë mesazhin e vjetër
    errorMsg.textContent = "";
    errorMsg.style.color = "red";

    const loginData = {
        Email: emailValue,
        PasswordHash: passwordValue,
        firstName: "", 
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
            
        const user = await getUser();
            

            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userName", data.firstName);
            

            if (user.role === 'Admin') {
             window.location.href = "/Admin"; 
            } else {
             window.location.href = "/home.html"; 
            }
            
        } else {

            errorMsg.textContent = "Invalid email or password. Please try again.";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        errorMsg.textContent = "Unable to connect to the server. Please ensure the backend is running.";
    });
});