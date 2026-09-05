/**
 * SOLAR SURYA GHAR — MAIN SITE BEHAVIOR
 * Handles: sticky nav state, mobile menu, scroll-reveal animations,
 * FAQ accordion, WhatsApp link injection, dynamic footer year.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavScroll();
    initMobileMenu();
    initScrollReveal();
    initAccordion();
    injectConfigValues();
    initFooterYear();
    initHeroSunArc();
  });

  /* ---------- Sticky nav appearance on scroll ---------- */
  function initNavScroll() {
    var nav = document.querySelector(".navbar");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initMobileMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (panel.classList.contains("is-open") && !panel.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    function closeMenu() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    }
  }

  /* ---------- Scroll-triggered reveal animation ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            var delay = entry.target.dataset.revealDelay || (index % 4) * 70;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Accessible FAQ / accordion ---------- */
  function initAccordion() {
    document.querySelectorAll(".accordion").forEach(function (accordion) {
      var triggers = accordion.querySelectorAll(".accordion__trigger");
      triggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var panel = document.getElementById(trigger.getAttribute("aria-controls"));
          var isOpen = trigger.getAttribute("aria-expanded") === "true";

          trigger.setAttribute("aria-expanded", String(!isOpen));
          if (panel) {
            panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
          }
        });
      });
    });
  }

  /* ---------- Inject configured phone/email/WhatsApp/location ---------- */
  function injectConfigValues() {
    var cfg = window.SSG_CONFIG || {};

    document.querySelectorAll("[data-cfg-phone]").forEach(function (el) {
      el.textContent = cfg.PHONE_DISPLAY || "[PHONE NUMBER]";
    });
    document.querySelectorAll("[data-cfg-phone-href]").forEach(function (el) {
      el.setAttribute("href", "tel:" + (cfg.PHONE_NUMBER || "").replace(/[^0-9+]/g, ""));
    });
    document.querySelectorAll("[data-cfg-email]").forEach(function (el) {
      el.textContent = cfg.EMAIL_ADDRESS || "[EMAIL ADDRESS]";
    });
    document.querySelectorAll("[data-cfg-email-href]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (cfg.EMAIL_ADDRESS || ""));
    });
    document.querySelectorAll("[data-cfg-location]").forEach(function (el) {
      el.textContent = cfg.SERVICE_LOCATION || "[SERVICE LOCATION]";
    });
    document.querySelectorAll("[data-cfg-whatsapp-href]").forEach(function (el) {
      el.setAttribute("href", window.SSG_getWhatsAppLink());
    });
  }

  /* ---------- Footer year ---------- */
  function initFooterYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Hero "sun arc" signature animation ---------- */
  function initHeroSunArc() {
    var sun = document.querySelector("[data-sun-token]");
    if (!sun) return;
    // Purely decorative CSS-driven motion; JS just marks it ready
    // so the CSS animation (which is paused by default) can start
    // smoothly after layout, avoiding a jump on load.
    requestAnimationFrame(function () {
      sun.classList.add("is-animating");
    });
  }
})();
