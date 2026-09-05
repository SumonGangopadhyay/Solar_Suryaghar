(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var search = document.querySelector('.blog-search input[type="search"]');
    var chips = document.querySelectorAll(".chip-row .chip");
    var cards = document.querySelectorAll(".grid.grid-3 > article");
    var activeCategory = "All";

    if (!search || !chips.length || !cards.length) return;

    function filterCards() {
      var query = search.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var category = card.querySelector(".blog-card__cat");
        var text = card.textContent.toLowerCase();
        var matchesCategory = activeCategory === "All" || (category && category.textContent.trim() === activeCategory);
        card.hidden = !(matchesCategory && (!query || text.indexOf(query) !== -1));
      });
    }

    search.addEventListener("input", filterCards);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCategory = chip.textContent.trim();
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });
        filterCards();
      });
    });
  });
})();