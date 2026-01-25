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

  // --- PIKA 7: VALIDIMI I EMAI-IT (Regex) ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMsg.textContent = "Ju lutem jepni një adresë email-i të saktë (p.sh. emri@shembull.com).";
    return;
  }

  // VALIDIMI I FJALËKALIMIT
  if (password !== confirmPassword) {
    errorMsg.textContent = "Fjalëkalimet nuk përputhen.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Fjalëkalimi duhet të jetë të paktën 6 karaktere.";
    return;
  }

  // Të dhënat që do të dërgohen në API

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
      alert("Regjistrimi u krye me sukses! Ju lutem kyçuni.");
      window.location.href = "login.html";
    } else {
      // Nëse emaili ekziston, API do të kthejë një gabim këtu
      return response.text().then(text => { throw new Error(text) });
    }
  })
  .catch(error => {
    errorMsg.textContent = "Gabim: " + error.message;
  });
});