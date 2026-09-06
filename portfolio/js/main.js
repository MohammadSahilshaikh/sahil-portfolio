/* ============================================================
   SHARED SITE BEHAVIOUR
   Nav bar + footer inject karta hai, ek-page scroll navigation
   (anchor links), scrollspy (jo section me ho wahi highlight +
   navbar color badalta hai), scroll-reveal animation, mobile menu.
   ============================================================ */

function isOnePagerFile() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path === "index.html" || path === "" || path === "/";
}

function buildNav(data) {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const onIndex = currentPath === "index.html" || currentPath === "" || currentPath === "/";
  const onGallery = currentPath === "gallery.html";
  const base = onIndex ? "" : "index.html";

  const links = [
    { id: "home", label: "Home", href: `${base}#home` },
    { id: "about", label: "About", href: `${base}#about` },
    { id: "experience", label: "Experience", href: `${base}#experience` },
    { id: "gallery", label: "Gallery", href: "gallery.html" },
    { id: "contact", label: "Contact", href: `${base}#contact` }
  ];

  const linksHtml = links
    .map((l) => {
      let isActive = false;
      if (onGallery && l.id === "gallery") isActive = true;
      else if (onIndex && l.id === "home") isActive = true;

      return `<a href="${l.href}" data-target="${l.id}" class="nav-link ${isActive ? "active" : ""}">${l.label}</a>`;
    })
    .join("");

  return `
  <nav class="navbar">
    <a href="${base || "#home"}" class="brand">
      <span class="brand-mark">CE</span>
      <span class="brand-text">${data.name}</span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links" id="navLinks">
      ${linksHtml}
      <a href="admin.html" class="nav-link admin-link">⚙ Admin</a>
    </div>
  </nav>`;
}

function buildFooter(data) {
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <div class="brand-text footer-brand">${data.name}</div>
        <p class="footer-role">${data.title}</p>
      </div>
      <div class="footer-contact">
        <span>${data.contact.email}</span>
        <span>${data.contact.phone}</span>
        <span>${data.contact.location}</span>
      </div>
    </div>
    <div class="blueprint-rule"></div>
    <p class="footer-copy">© ${year} ${data.name} — Built with Engineering Precision 🏗</p>
  </footer>`;
}

function injectLayout() {
  const data = getData();
  const navMount = document.getElementById("navMount");
  const footMount = document.getElementById("footMount");
  if (navMount) navMount.innerHTML = buildNav(data);
  if (footMount) footMount.innerHTML = buildFooter(data);

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.classList.toggle("open");
    });
    // Mobile menu par link click hote hi menu band ho jaye
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }
  return data;
}

// Scroll reveal using IntersectionObserver
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => observer.observe(el));
}

// Scrollspy: scroll karte time nav highlight + navbar color badalta hai
function initScrollSpy() {
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("[data-nav]");
  if (!navbar || sections.length === 0) return;

  const navLinks = document.querySelectorAll(".nav-link[data-target]");

  function updateActiveNav() {
    let currentNav = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentNav = sec.getAttribute("data-nav");
        const theme = sec.getAttribute("data-theme");
        navbar.classList.toggle("on-light", theme === "light");
      }
    });

    if (currentNav) {
      navLinks.forEach((l) => {
        l.classList.toggle("active", l.getAttribute("data-target") === currentNav);
      });
    }
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
}

// Lazy Load EmailJS SDK script dynamically on demand
let emailjsPromise = null;
function loadEmailJS() {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  if (emailjsPromise) return emailjsPromise;

  emailjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      resolve(window.emailjs);
    };
    script.onerror = () => {
      emailjsPromise = null;
      reject(new Error("Failed to load EmailJS SDK"));
    };
    document.head.appendChild(script);
  });

  return emailjsPromise;
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initScrollSpy();
});

