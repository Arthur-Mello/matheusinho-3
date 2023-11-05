const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  signupBtnMainPage = document.querySelector("#signupMain"),
  loginBtn = document.querySelector("#login"),
  loginBtn2 = document.querySelector("#login2"),
  pwShowHide = document.querySelectorAll(".pw_hide"),
  recoverPass = document.querySelector(".forgot_pw");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
signupBtnMainPage.addEventListener("click", () => home.classList.add("show")); 


pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
  formContainer.classList.remove("recover");
});

signupBtnMainPage.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
  formContainer.classList.remove("recover");
});

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
  formContainer.classList.remove("recover");
});
loginBtn2.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
  formContainer.classList.remove("recover");
});
formOpenBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
  formContainer.classList.remove("recover");
});

recoverPass.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
  formContainer.classList.add("recover");
});
