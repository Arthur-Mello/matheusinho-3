const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("passwordError");
  
  confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value === passwordInput.value) {
      passwordError.textContent = ""; // Passwords match, no error message
    } else {
      passwordError.textContent = "As senhas não coincidem.";
    }
  });