const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const loginData = {
    email: email,
    passwordHash: password 
  };

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Invalid email or password.");
    }
  })
  .then(data => {
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userName', data.firstName);
    localStorage.setItem('isLoggedIn', 'true');

    alert("Login successful! Welcome " + data.firstName);
    window.location.href = "../index.html"; 
  })
  .catch(error => {
    errorMsg.textContent = error.message;
    errorMsg.style.color = "red";
  });
});