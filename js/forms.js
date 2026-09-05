/**
 * SOLAR SURYA GHAR — FORM VALIDATION & SUBMISSION
 * ----------------------------------------------------------
 * Validates the quote / contact forms client-side and, when
 * a backend is connected via SSG_CONFIG.API_BASE_URL, submits
 * to POST /api/enquiries. Until a backend exists, submission
 * is intentionally NOT faked as "sent" — see submitEnquiry().
 * ----------------------------------------------------------
 */
(function () {
  "use strict";

  var PHONE_PATTERN = /^[+]?[0-9\s-]{10,15}$/;
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("form[data-enquiry-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmit(form);
      });

      // Clear error state as the person fixes a field.
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        field.addEventListener("input", function () {
          var wrapper = field.closest(".field");
          if (wrapper) wrapper.classList.remove("has-error");
        });
      });
    });
  });

  function handleSubmit(form) {
    var formCard = form.closest(".form-card");
    var statusEl = formCard ? formCard.querySelector(".form-status") : form.querySelector(".form-status");
    var errors = validateForm(form);

    if (errors.length) {
      showStatus(statusEl, "error", "Please fix the highlighted fields below and try again.");
      var firstError = form.querySelector(".field.has-error input, .field.has-error select, .field.has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    submitEnquiry(collectFormData(form))
      .then(function () {
        showStatus(statusEl, "success", "Thank you! Your enquiry has been received. Our team will contact you shortly.");
        form.reset();
      })
      .catch(function () {
        showStatus(
          statusEl,
          "error",
          "This form isn't connected to a backend yet, so it can't be submitted. See the README for how to connect it to the Flask API."
        );
      });
  }

  function validateForm(form) {
    var errors = [];
    var requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(function (field) {
      var wrapper = field.closest(".field");
      var value = field.value ? field.value.trim() : "";
      var invalid = !value;

      if (!invalid && field.type === "tel") {
        invalid = !PHONE_PATTERN.test(value);
      } else if (!invalid && field.type === "email") {
        invalid = !EMAIL_PATTERN.test(value);
      }

      if (invalid) {
        errors.push(field.name);
        if (wrapper) wrapper.classList.add("has-error");
      } else if (wrapper) {
        wrapper.classList.remove("has-error");
      }
    });

    form.querySelectorAll('input[type="number"]').forEach(function (field) {
      if (!field.value.trim()) return;

      var numericValue = Number(field.value);
      var minimum = field.getAttribute("min");
      var maximum = field.getAttribute("max");
      var invalid = !Number.isFinite(numericValue) ||
        (minimum !== null && numericValue < Number(minimum)) ||
        (maximum !== null && numericValue > Number(maximum));
      var wrapper = field.closest(".field");

      if (invalid) {
        errors.push(field.name);
        if (wrapper) wrapper.classList.add("has-error");
      }
    });

    // Optional email field: only validate format if something is entered.
    var optionalEmail = form.querySelector('input[type="email"]:not([required])');
    if (optionalEmail && optionalEmail.value.trim() && !EMAIL_PATTERN.test(optionalEmail.value.trim())) {
      errors.push("email");
      var wrapper = optionalEmail.closest(".field");
      if (wrapper) wrapper.classList.add("has-error");
    }

    return errors;
  }

  function collectFormData(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value;
    });
    return data;
  }

  /**
   * Submits the enquiry to the configured backend, if one exists.
   * With no API_BASE_URL configured, this deliberately rejects
   * instead of pretending the enquiry was sent — see README for
   * how to connect a real Flask backend at POST /api/enquiries.
   */
  function submitEnquiry(data) {
    var cfg = window.SSG_CONFIG || {};

    if (!cfg.API_BASE_URL) {
      return Promise.reject(new Error("No backend configured (SSG_CONFIG.API_BASE_URL is empty)."));
    }

    var endpoint = cfg.API_BASE_URL + (cfg.API_ENDPOINTS && cfg.API_ENDPOINTS.enquiries ? cfg.API_ENDPOINTS.enquiries : "/api/enquiries");

    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (response) {
      if (!response.ok) throw new Error("Request failed with status " + response.status);
      return response.json().catch(function () { return {}; });
    });
  }

  function showStatus(statusEl, type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    statusEl.classList.add(type === "success" ? "is-success" : "is-error");
    statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
