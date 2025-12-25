
const emailForm = document.getElementById("emailForm");
const codeForm = document.getElementById("codeForm");
const newPasswordForm = document.getElementById("newPasswordForm");
const message = document.getElementById("message");

let generatedCode = "";

emailForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    message.textContent = "Please enter your email address.";
    return;
  }

  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();


  alert(`Simulated email sent to ${email}!\nYour verification code: ${generatedCode}`);


  emailForm.classList.add("hidden");
  codeForm.classList.remove("hidden");
  message.textContent = "";
});


codeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const codeInput = document.getElementById("codeInput").value.trim();

  if (codeInput === generatedCode) {
    codeForm.classList.add("hidden");
    newPasswordForm.classList.remove("hidden");
    message.textContent = "";
  } else {
    message.textContent = "Invalid verification code!";
  }
});


newPasswordForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

  if (newPassword.length < 6) {
    message.textContent = "Password must be at least 6 characters long.";
    return;
  }

  if (newPassword !== confirmNewPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }


  alert("Password changed successfully!");
  window.location.href = "login.html";
});