(function () {
  var KEY = "nr-theme";

  function isNight() {
    return document.documentElement.getAttribute("data-theme") === "night";
  }

  function apply(night) {
    if (night) document.documentElement.setAttribute("data-theme", "night");
    else document.documentElement.removeAttribute("data-theme");

    try {
      localStorage.setItem(KEY, night ? "night" : "day");
    } catch (e) {}

    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.hidden = false;
      btn.setAttribute("aria-pressed", night ? "true" : "false");
      btn.textContent = night ? "昼色" : "夜读";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(isNight());
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(!isNight());
      });
    });
  });
})();
