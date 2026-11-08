(function () {
  function initProgress() {
    var bar = document.querySelector(".reading-progress span");
    if (!bar) return;

    var root = document.documentElement;

    function update() {
      var max = root.scrollHeight - window.innerHeight;
      var progress = max > 0 ? window.scrollY / max : 0;
      progress = Math.min(1, Math.max(0, progress));
      bar.style.width = (progress * 100).toFixed(2) + "%";
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProgress);
  } else {
    initProgress();
  }
})();
