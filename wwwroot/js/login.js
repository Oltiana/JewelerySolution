
const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");


loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "test@example.com" && password === "123456") {
    alert("Login successful!");

  } else {
    errorMsg.textContent = "Invalid email or password";
  }
});