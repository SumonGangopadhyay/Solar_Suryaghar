/**
 * SOLAR SURYA GHAR — GLOBAL CONFIGURATION
 * ----------------------------------------------------------
 * Edit the values in this file to update contact details,
 * the WhatsApp number, API endpoints and analytics IDs
 * across the ENTIRE website. Nothing else needs to change.
 * ----------------------------------------------------------
 */
window.SSG_CONFIG = {
  // Replace with the real business WhatsApp number in international
  // format, digits only (e.g. "919812345678"). Used to build
  // wa.me links across every page.
  WHATSAPP_NUMBER: "[WHATSAPP_NUMBER]",

  // Replace with the real business phone number as it should be dialed.
  PHONE_NUMBER: "[PHONE NUMBER]",
  PHONE_DISPLAY: "[PHONE NUMBER]",

  // Replace with the real business email address.
  EMAIL_ADDRESS: "[EMAIL ADDRESS]",

  // Replace with the real service area / office location.
  SERVICE_LOCATION: "[SERVICE LOCATION]",

  // Default WhatsApp message pre-fill.
  WHATSAPP_MESSAGE: "Hi Solar Surya Ghar, I'd like to know more about rooftop solar for my property.",

  // Future Flask backend base URL. Point this at your live API
  // once it exists, e.g. "https://api.solarsuryaghar.co.in".
  API_BASE_URL: "",

  // Suggested future endpoints (see README for details):
  API_ENDPOINTS: {
    enquiries: "/api/enquiries",
    quote: "/api/quote",
    contact: "/api/contact",
    blog: "/api/blog",
    projects: "/api/projects"
  },

  // Add your Google Analytics 4 Measurement ID here (format: G-XXXXXXXXXX).
  // Leave empty to keep analytics disabled.
  GA_MEASUREMENT_ID: "",

  // Add your Google Search Console HTML verification meta content here
  // (the "content" value Search Console gives you), or use the
  // file-based verification method described in the README instead.
  GSC_VERIFICATION: ""
};

/**
 * Builds a wa.me link from the configured WhatsApp number + message.
 */
window.SSG_getWhatsAppLink = function () {
  var cfg = window.SSG_CONFIG;
  var digits = (cfg.WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
  if (!digits) return "#";
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(cfg.WHATSAPP_MESSAGE || "");
};
