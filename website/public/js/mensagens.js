document.addEventListener("DOMContentLoaded", function () {
  const authMessages = {
    "success": "Usuário cadastrado com sucesso.",
    "error": "Usuário não foi cadastrado por algum erro interno.",
    "erroremailEmUso": "Este email já está em uso.",
    "errorsenhaCurta": "Senha muito curta, deve ter pelo menos 8 caracteres.",
    "errorsenhasDiferentes": "Senha de confirmação diferente da senha cadastrada",
    "errorinvalido": "Email ou senha inválido, certifique-se que o seu usuário esteja cadastrado.",
    "errornaologado": "Usuario não está logado.",
    "errortokenExpirado": "Tempo de sessão acabado, por favor, faça login novamente.",
    "logout": "Deslogado com sucesso!",
    "errorpermissao": "Você não tem acesso a essa tela"
  };

  const popupContainer = document.createElement("div");
  popupContainer.className = "popup-container";

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";

  const closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times";

  const messageElement = document.createElement("p");
  messageElement.id = "messageContainer";

  const urlParams = new URLSearchParams(window.location.search);
  const messageKey = urlParams.get("message");

  if (authMessages[messageKey]) {
    messageElement.textContent = authMessages[messageKey];

    popupContent.appendChild(closeButton);
    popupContent.appendChild(messageElement);
    popupContainer.appendChild(popupContent);

    const section = document.querySelector("section");
    section.appendChild(popupContainer);

    setTimeout(function () {
      popupContainer.classList.add("active");
    }, 100);

    if (messageKey.startsWith("error")) {

      popupContainer.classList.add("error");
    }

    setTimeout(function () {
      popupContainer.classList.remove("active");

      setTimeout(function () {
        section.removeChild(popupContainer);
      }, 500);
    }, 5000);
  }

  closeButton.addEventListener("click", function () {
    const section = document.querySelector("section");
    section.removeChild(popupContainer);
  });
});
