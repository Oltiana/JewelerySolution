const emailForm = document.getElementById("emailForm");
const codeForm = document.getElementById("codeForm");
const newPasswordForm = document.getElementById("newPasswordForm");
const message = document.getElementById("message");

let userEmail = "";

emailForm.addEventListener("submit", function (e) {
  e.preventDefault();
  userEmail = document.getElementById("email").value.trim();

  fetch('/api/auth/send-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  })
  .then(res => {
    if (res.ok) {
      emailForm.classList.add("hidden");
      codeForm.classList.remove("hidden");
      message.textContent = "Code sent! Check the server console in Visual Studio.";
      message.style.color = "green";
    } else {
      throw new Error("Email not found.");
    }
  })
  .catch(err => {
    message.textContent = err.message;
    message.style.color = "red";
  });
});

codeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const code = document.getElementById("codeInput").value.trim();

  fetch('/api/auth/verify-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code })
  })
  .then(res => {
    if (res.ok) {
      codeForm.classList.add("hidden");
      newPasswordForm.classList.remove("hidden");
      message.textContent = "Code verified. Please enter your new password.";
      message.style.color = "green";
    } else {
      throw new Error("Invalid verification code.");
    }
  })
  .catch(err => {
    message.textContent = err.message;
    message.style.color = "red";
  });
});

newPasswordForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

  if (newPassword.length < 6) {
    message.textContent = "Password must be at least 6 characters long.";
    message.style.color = "red";
    return;
  }

  if (newPassword !== confirmNewPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
    return;
  }

  fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: userEmail, 
      passwordHash: newPassword 
    })
  })
  .then(res => {
    if (res.ok) {
      alert("Password changed successfully!");
      window.location.href = "login.html";
    } else {
      throw new Error("Error updating password.");
    }
  })
  .catch(err => {
    message.textContent = err.message;
    message.style.color = "red";
  });
});