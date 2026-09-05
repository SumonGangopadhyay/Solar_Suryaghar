/**
 * SOLAR SURYA GHAR — SOLAR SAVINGS CALCULATOR
 * ----------------------------------------------------------
 * IMPORTANT: The assumptions below (units generated per kW,
 * blended tariff, cost per kW, etc.) are placeholder planning
 * figures, not verified data. They are isolated in the
 * CALC_ASSUMPTIONS object below so they can be replaced with
 * real, location-specific figures (or with a live Flask API
 * response) without touching the rest of the logic.
 *
 * All results are clearly labeled as estimates in the UI.
 * ----------------------------------------------------------
 */
(function () {
  "use strict";

  var CALC_ASSUMPTIONS = {
    // Average units (kWh) generated per year for every 1 kW of
    // installed rooftop solar capacity. Replace with a verified,
    // location-specific figure (or per-state table) when available.
    unitsPerKwPerYear: 1400,

    // Placeholder blended electricity tariff (INR per unit/kWh)
    // used only until a real, state-wise tariff table is available.
    blendedTariffPerUnit: 7,

    // Placeholder indicative installed cost per kW (INR), used only
    // to illustrate a payback period. Replace with real, current
    // pricing before showing this to customers.
    indicativeCostPerKw: 55000,

    // Minimum and maximum recommended system size, in kW, that the
    // calculator will suggest.
    minSystemKw: 1,
    maxSystemKw: 15
  };

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("solar-calculator-form");
    if (!form) return;

    var resultsPanel = document.getElementById("calculator-results");
    var placeholder = document.getElementById("calculator-placeholder");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate(form)) return;

      var input = {
        monthlyBill: parseFloat(form.monthlyBill.value) || 0,
        monthlyUnits: parseFloat(form.monthlyUnits.value) || 0,
        propertyType: form.propertyType.value,
        state: form.state.value
      };

      var estimate = calculateEstimate(input);
      renderResults(estimate);

      if (placeholder) placeholder.style.display = "none";
      if (resultsPanel) resultsPanel.style.display = "block";
    });
  });

  function validate(form) {
    var valid = true;
    var requiredFields = ["monthlyBill", "state", "monthlyUnits"];

    requiredFields.forEach(function (name) {
      var field = form[name];
      if (!field) return;
      var wrapper = field.closest(".field");
      var value = field.value ? field.value.trim() : "";

      if (!value || (field.type === "number" && Number(value) <= 0)) {
        valid = false;
        if (wrapper) wrapper.classList.add("has-error");
      } else if (wrapper) {
        wrapper.classList.remove("has-error");
      }
    });

    var propertyType = form.querySelector('input[name="propertyType"]:checked');
    var propertyTypeGroup = form.querySelector('[role="radiogroup"]');
    if (!propertyType && propertyTypeGroup) {
      valid = false;
      propertyTypeGroup.classList.add("has-error");
    } else if (propertyTypeGroup) {
      propertyTypeGroup.classList.remove("has-error");
    }

    return valid;
  }

  /**
   * Core estimate logic. Kept pure (no DOM access) so it can be
   * unit-tested or later replaced with a fetch() call to a real
   * backend endpoint, e.g. SSG_CONFIG.API_ENDPOINTS.quote.
   */
  function calculateEstimate(input) {
    var a = CALC_ASSUMPTIONS;

    // Estimate monthly consumption in units if only the bill was
    // meaningfully provided, otherwise trust the entered units.
    var monthlyUnits = Number.isFinite(input.monthlyUnits) && input.monthlyUnits > 0
      ? input.monthlyUnits
      : input.monthlyBill / a.blendedTariffPerUnit;

    var annualUnits = monthlyUnits * 12;
    var effectiveTariff = Number.isFinite(input.monthlyBill) && input.monthlyBill > 0 && monthlyUnits > 0
      ? input.monthlyBill / monthlyUnits
      : a.blendedTariffPerUnit;

    var recommendedKw = annualUnits / a.unitsPerKwPerYear;
    recommendedKw = Math.min(Math.max(recommendedKw, a.minSystemKw), a.maxSystemKw);
    recommendedKw = Math.round(recommendedKw * 2) / 2; // round to nearest 0.5 kW

    var estimatedAnnualGeneration = recommendedKw * a.unitsPerKwPerYear;
    var estimatedAnnualSavings = Math.min(
      estimatedAnnualGeneration * effectiveTariff,
      input.monthlyBill > 0 ? input.monthlyBill * 12 : Infinity
    );
    var indicativeSystemCost = recommendedKw * a.indicativeCostPerKw;
    var paybackYears = estimatedAnnualSavings > 0
      ? indicativeSystemCost / estimatedAnnualSavings
      : 0;

    return {
      recommendedKw: recommendedKw,
      estimatedAnnualGeneration: Math.round(estimatedAnnualGeneration),
      estimatedAnnualSavings: Math.round(estimatedAnnualSavings),
      paybackYears: paybackYears
    };
  }

  function renderResults(estimate) {
    setText("result-system-size", estimate.recommendedKw + " kW (estimated)");
    setText("result-generation", formatNumber(estimate.estimatedAnnualGeneration) + " units / year (estimated)");
    setText("result-savings", "₹" + formatNumber(estimate.estimatedAnnualSavings) + " / year (estimated)");
    setText("result-payback", estimate.paybackYears > 0 ? estimate.paybackYears.toFixed(1) + " years (indicative)" : "—");
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatNumber(num) {
    return Math.round(num).toLocaleString("en-IN");
  }
})();
