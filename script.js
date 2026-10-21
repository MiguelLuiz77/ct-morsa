const galleries = {
  adultos: {
    title: "Jiu-Jitsu Adulto",
    images: [
      { src: "adultos-1.jpeg", alt: "Alunos adultos em momento de concentração no tatame", width: 4392, height: 2928 },
      { src: "adultos-2.jpeg", alt: "Turma adulta reunida para o treino", width: 6000, height: 4000 },
      { src: "adultos-3(capa).jpeg", alt: "Foto de grupo da equipe adulta do CT Morsa", width: 6000, height: 4000 }
    ]
  },
  kids: {
    title: "Jiu-Jitsu Kids",
    images: [
      { src: "kids-1.jpeg", alt: "Alunos da turma kids praticando jiu-jitsu", width: 5451, height: 3634 },
      { src: "kids-2.jpeg", alt: "Alunas da turma kids treinando uma posição", width: 3543, height: 5314 },
      { src: "kids-3(capa).jpeg", alt: "Foto de grupo da turma kids do CT Morsa", width: 5726, height: 3817 }
    ]
  }
};

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCount = document.querySelector("#lightbox-count");
const lightboxThumbs = document.querySelector("#lightbox-thumbs");
const closeButton = document.querySelector(".lightbox-close");
let currentGallery = null;
let currentIndex = 0;
let previousFocus = null;
let touchStartX = null;

function updateGallery() {
  const image = currentGallery.images[currentIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxImage.width = image.width;
  lightboxImage.height = image.height;
  lightboxCount.textContent = `${currentIndex + 1} / ${currentGallery.images.length}`;
  [...lightboxThumbs.children].forEach((thumb, index) => {
    thumb.setAttribute("aria-current", String(index === currentIndex));
  });
}

function openGallery(name) {
  currentGallery = galleries[name];
  if (!currentGallery) return;
  currentIndex = 0;
  previousFocus = document.activeElement;
  lightboxTitle.textContent = currentGallery.title;
  lightboxThumbs.replaceChildren();
  currentGallery.images.forEach((image, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "lightbox-thumb";
    thumb.setAttribute("aria-label", `Mostrar foto ${index + 1}`);
    thumb.setAttribute("aria-current", String(index === currentIndex));
    const preview = document.createElement("img");
    preview.src = image.src;
    preview.alt = image.alt;
    preview.width = image.width;
    preview.height = image.height;
    preview.loading = "lazy";
    preview.decoding = "async";
    thumb.append(preview);
    thumb.addEventListener("click", () => {
      currentIndex = index;
      updateGallery();
    });
    lightboxThumbs.append(thumb);
  });
  updateGallery();
  document.body.classList.add("modal-open");
  lightbox.showModal();
  closeButton.focus();
}

function moveGallery(direction) {
  if (!currentGallery) return;
  currentIndex = (currentIndex + direction + currentGallery.images.length) % currentGallery.images.length;
  updateGallery();
}

function closeGallery() {
  if (lightbox.open) lightbox.close();
}

document.querySelectorAll("[data-open-gallery]").forEach((button) => {
  button.addEventListener("click", () => openGallery(button.dataset.openGallery));
});
document.querySelector(".lightbox-prev").addEventListener("click", () => moveGallery(-1));
document.querySelector(".lightbox-next").addEventListener("click", () => moveGallery(1));
closeButton.addEventListener("click", closeGallery);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeGallery();
});
lightbox.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  previousFocus?.focus();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") moveGallery(1);
  if (event.key === "ArrowLeft") moveGallery(-1);
});
const lightboxMedia = document.querySelector(".lightbox-media");
lightboxMedia.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") touchStartX = event.clientX;
});
lightboxMedia.addEventListener("pointerup", (event) => {
  if (touchStartX === null) return;
  const distance = event.clientX - touchStartX;
  if (Math.abs(distance) > 45) moveGallery(distance < 0 ? 1 : -1);
  touchStartX = null;
});
lightboxMedia.addEventListener("pointercancel", () => { touchStartX = null; });

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  siteNav.classList.remove("is-open");
}
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  siteNav.classList.toggle("is-open", !isOpen);
});
siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealTargets = document.querySelectorAll("[data-reveal], [data-text-reveal]");
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  document.querySelectorAll("[data-text-reveal]").forEach((element) => {
    const label = element.textContent.replace(/\s+/g, " ").trim();
    element.setAttribute("aria-label", label);
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let wordIndex = 0;
    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "copy-word";
        word.setAttribute("aria-hidden", "true");
        word.style.setProperty("--word-delay", `${wordIndex * 28}ms`);
        word.textContent = part;
        fragment.append(word);
        wordIndex += 1;
      });
      node.replaceWith(fragment);
    });
  });
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const header = document.querySelector(".site-header");
const headerSentinel = document.querySelector("[data-header-sentinel]");
if ("IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-solid", !entry.isIntersecting);
  });
  headerObserver.observe(headerSentinel);
} else {
  header.classList.add("is-solid");
}
