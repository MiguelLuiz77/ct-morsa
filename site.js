(() => {
  const analyticsId = window.CTMorsaConfig?.googleAnalyticsId || "";
  const consentKey = "ct-morsa-analytics-consent";
  let analyticsStarted = false;

  function startAnalytics() {
    if (analyticsStarted || !/^G-[A-Z0-9]+$/.test(analyticsId)) return;
    analyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { anonymize_ip: true });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    script.onerror = () => { analyticsStarted = false; };
    document.head.append(script);
  }

  function savedConsent() {
    try { return localStorage.getItem(consentKey); } catch { return null; }
  }

  function saveConsent(value) {
    try { localStorage.setItem(consentKey, value); } catch { /* Storage can be disabled by the browser. */ }
    if (value === "accepted") startAnalytics();
  }

  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Preferências de privacidade");
  banner.hidden = true;
  banner.innerHTML = `
    <div class="cookie-copy"><strong>Privacidade e análise</strong>
      <p>Usamos armazenamento local para guardar sua escolha. A análise de visitas só começa com sua autorização e após a configuração de um ID de análise. <a href="privacidade">Leia a política de privacidade</a>.</p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="button button-outline" data-cookie-deny>Apenas necessários</button>
      <button type="button" class="button" data-cookie-accept>Permitir análise</button>
    </div>`;
  document.body.append(banner);

  function showBanner(moveFocus = false) {
    banner.hidden = false;
    if (moveFocus) banner.querySelector("[data-cookie-deny]").focus();
  }

  banner.querySelector("[data-cookie-deny]").addEventListener("click", () => {
    saveConsent("denied");
    banner.hidden = true;
  });
  banner.querySelector("[data-cookie-accept]").addEventListener("click", () => {
    saveConsent("accepted");
    banner.hidden = true;
  });
  document.querySelectorAll("[data-cookie-preferences]").forEach((button) => button.addEventListener("click", () => showBanner(true)));

  const consent = savedConsent();
  if (consent === "accepted") startAnalytics();
  else if (!consent) window.setTimeout(showBanner, 350);

  document.querySelectorAll("[data-load-map]").forEach((button) => {
    button.addEventListener("click", () => {
      const frame = button.closest(".map-frame")?.querySelector("iframe");
      const status = button.parentElement.querySelector(".map-status");
      if (!frame) return;
      button.disabled = true;
      button.textContent = "Carregando mapa…";
      if (status) status.textContent = "Conectando ao Google Maps.";
      frame.addEventListener("load", () => {
        button.closest(".map-placeholder").hidden = true;
        frame.hidden = false;
      }, { once: true });
      frame.src = button.dataset.mapSrc;
      window.setTimeout(() => {
        if (frame.hidden) {
          button.disabled = false;
          button.textContent = "Tentar novamente";
          if (status) status.textContent = "O mapa não carregou. Use o link “Como chegar” para abrir o Google Maps.";
        }
      }, 12000);
    });
  });

  if (!document.body.hasAttribute("data-no-mobile-cta")) {
    const sticky = document.createElement("a");
    sticky.className = "mobile-sticky-cta";
    sticky.href = "contato";
    sticky.textContent = "Agendar aula experimental";
    sticky.setAttribute("aria-label", "Agendar uma aula experimental gratuita");
    document.body.append(sticky);
  }
})();
