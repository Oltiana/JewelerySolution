const signupForm = document.getElementById("signupForm");
const errorMsg = document.getElementById("errorMsg");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  errorMsg.textContent = "";

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters long.";
    return;
  }

  const signupData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    passwordHash: password
  };

  fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(signupData)
  })
  .then(response => {
    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "login.html";
    } else {
      return response.text().then(text => { throw new Error(text) });
    }
  })
  .catch(error => {
    errorMsg.textContent = "Error: " + error.message;
  });
});