(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const submit = form.querySelector("[type=submit]");
  const fallback = document.querySelector("#whatsapp-fallback");
  const fields = [...form.querySelectorAll("input, textarea")];

  function setError(field, message) {
    const target = document.querySelector(`#${field.id}-error`);
    if (target) target.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  fields.forEach((field) => field.addEventListener("input", () => setError(field, "")));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    fields.forEach((field) => {
      let message = "";
      if (!field.value.trim()) message = "Preencha este campo.";
      else if (field.type === "tel" && field.value.replace(/\D/g, "").length < 10) message = "Informe um telefone válido com DDD.";
      setError(field, message);
      if (message) valid = false;
    });
    if (!valid) {
      status.textContent = "Revise os campos destacados para continuar.";
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = new FormData(form);
    const message = [
      "Olá! Quero saber mais sobre uma aula experimental no CT Morsa.",
      `Nome: ${data.get("name").trim()}`,
      `Telefone: ${data.get("phone").trim()}`,
      `Mensagem: ${data.get("message").trim()}`
    ].join("\n");
    const url = `https://wa.me/5512997653246?text=${encodeURIComponent(message)}`;
    submit.disabled = true;
    submit.textContent = "Preparando WhatsApp…";
    status.textContent = "Abrindo uma conversa com a equipe…";
    fallback.href = url;
    fallback.hidden = false;
    const popup = window.open(url, "_blank");
    if (popup) popup.opener = null;
    window.setTimeout(() => {
      if (popup) window.location.assign("obrigado");
      else {
        submit.disabled = false;
        submit.textContent = "Tentar abrir o WhatsApp novamente";
        status.textContent = "O navegador bloqueou a nova janela. Use o link do WhatsApp abaixo para enviar sua mensagem.";
        fallback.focus();
      }
    }, 500);
  });
})();
