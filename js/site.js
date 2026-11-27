(function () {
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inline(text) {
    return escapeHtml(text)
      .replace(/\{([^{}|｜]+)[|｜]([^{}]+)\}/g, "<ruby>$1<rt>$2</rt></ruby>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  }

  function renderMarkdown(markdown) {
    var text = markdown.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
    if (!text) return "";

    return text.split("\n").map(function (line) {
      var trimmed = line.trim();
      if (!trimmed) return "";
      var heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        var tag = heading[1].length === 1 ? "h2" : "h3";
        return "<" + tag + ">" + inline(heading[2]) + "</" + tag + ">";
      }
      return "<p>" + inline(trimmed) + "</p>";
    }).join("\n");
  }

  function siblingMarkdown() {
    var name = location.pathname.split("/").pop() || "index.html";
    if (!/\.html?$/i.test(name)) name = "index.html";
    return name.replace(/\.html?$/i, ".md");
  }

  function initProgress() {
    var bar = document.querySelector(".reading-progress span");
    if (!bar) return function () {};

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
    return update;
  }

  function initChapter(updateProgress) {
    var slot = document.querySelector(".chapter-body");
    if (!slot) return;

    var src = slot.getAttribute("data-md") || siblingMarkdown();

    fetch(src)
      .then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        return response.text();
      })
      .then(function (markdown) {
        slot.innerHTML = renderMarkdown(markdown);
        updateProgress();
      })
      .catch(function () {
        updateProgress();
      });
  }

  function init() {
    var updateProgress = initProgress();
    initChapter(updateProgress);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
