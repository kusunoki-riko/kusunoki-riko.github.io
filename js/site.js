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

  function initShelf() {
    var links = Array.prototype.map.call(
      document.querySelectorAll(".toc a[href]"),
      function (anchor) { return anchor.getAttribute("href"); }
    ).filter(Boolean);
    var note = document.querySelector("[data-chapter-count]");
    if (note) note.textContent = "共 " + links.length + " 章";

    var button = document.querySelector("[data-random]");
    if (!button || !links.length) return;
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var pick = links[Math.floor(Math.random() * links.length)];
      location.href = pick;
    });
  }

  function articleTitle(anchor) {
    var title = anchor.querySelector("span");
    return (title ? title.textContent : anchor.textContent).replace(/\s+/g, " ").trim();
  }

  function safePageHref(href) {
    if (!href || /^(?:[a-z]+:|\/\/)/i.test(href)) return "";
    return href;
  }

  function fillPagerSlot(slot, href, title) {
    if (!slot) return;
    var label = slot.querySelector(".chapter-nav-label");
    var name = slot.querySelector("[data-prev-title], [data-next-title]");
    if (!href) {
      if (name) name.textContent = "没有了";
      return;
    }
    var link = document.createElement("a");
    link.setAttribute("href", href);
    if (label) link.appendChild(label);
    var caption = document.createElement("span");
    caption.textContent = title || href;
    link.appendChild(caption);
    slot.replaceWith(link);
  }

  function bindGroupToggle(button, list) {
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", open ? "true" : "false");
      list.hidden = !open;
    });
  }

  function initBlogTree() {
    var tree = document.querySelector("[data-blog-tree]");
    if (!tree) return;
    var rail = tree.closest(".blog-read");
    var railToggle = rail ? rail.querySelector(".blog-rail-toggle") : null;
    var body = tree.querySelector(".blog-tree-body");
    if (railToggle && body) {
      railToggle.addEventListener("click", function () {
        var open = railToggle.getAttribute("aria-expanded") !== "true";
        railToggle.setAttribute("aria-expanded", open ? "true" : "false");
        railToggle.setAttribute("aria-label", open ? "收起目录" : "展开目录");
        body.hidden = !open;
        if (rail) rail.classList.toggle("is-rail-closed", !open);
      });
    }
    Array.prototype.forEach.call(tree.querySelectorAll(".blog-tree-group"), function (group) {
      var button = group.querySelector(".blog-group-toggle");
      var list = group.querySelector(".blog-tree-list");
      if (button && list) bindGroupToggle(button, list);
    });

    var shelfUrl = new URL("../index.html", location.href);
    fetch(shelfUrl.href)
      .then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var works = Array.prototype.map.call(doc.querySelectorAll(".entry-list a[href]"), function (anchor) {
          var href = safePageHref(anchor.getAttribute("href"));
          if (!href) return null;
          var strong = anchor.querySelector("strong");
          return {
            title: (strong ? strong.textContent : anchor.textContent).replace(/\s+/g, " ").trim(),
            indexUrl: new URL(href, shelfUrl)
          };
        }).filter(Boolean);
        return Promise.all(works.map(function (work) {
          return fetch(work.indexUrl.href)
            .then(function (response) {
              if (!response.ok) throw new Error("status " + response.status);
              return response.text();
            })
            .then(function (pageHtml) {
              var page = new DOMParser().parseFromString(pageHtml, "text/html");
              work.chapters = Array.prototype.map.call(page.querySelectorAll(".toc a[href]"), function (anchor) {
                var href = safePageHref(anchor.getAttribute("href"));
                if (!href) return null;
                return { title: articleTitle(anchor), url: new URL(href, work.indexUrl) };
              }).filter(Boolean);
              return work;
            })
            .catch(function () {
              work.chapters = [];
              return work;
            });
        }));
      })
      .then(function (works) {
        var host = tree.querySelector(".blog-tree-groups");
        if (!host || !works.length) return;
        host.textContent = "";
        var hereWork = null;
        var hereIndex = -1;
        works.forEach(function (work) {
          var group = document.createElement("section");
          group.className = "blog-tree-group";
          var button = document.createElement("button");
          button.type = "button";
          button.className = "blog-group-toggle";
          button.setAttribute("aria-expanded", "true");
          var mark = document.createElement("span");
          mark.className = "blog-tree-mark";
          mark.setAttribute("aria-hidden", "true");
          var name = document.createElement("span");
          name.className = "blog-tree-title";
          name.textContent = work.title;
          button.appendChild(mark);
          button.appendChild(name);
          var list = document.createElement("ol");
          list.className = "blog-tree-list";
          work.chapters.forEach(function (chapter, index) {
            var item = document.createElement("li");
            var link = document.createElement("a");
            link.href = chapter.url.href;
            link.textContent = chapter.title;
            if (chapter.url.pathname === location.pathname) {
              link.setAttribute("aria-current", "page");
              hereWork = work;
              hereIndex = index;
            }
            item.appendChild(link);
            list.appendChild(item);
          });
          bindGroupToggle(button, list);
          group.appendChild(button);
          group.appendChild(list);
          host.appendChild(group);
        });
        var prev = hereWork && hereIndex > 0 ? hereWork.chapters[hereIndex - 1] : null;
        var next = hereWork && hereIndex >= 0 && hereIndex < hereWork.chapters.length - 1
          ? hereWork.chapters[hereIndex + 1]
          : null;
        fillPagerSlot(document.querySelector("[data-prev]"), prev ? prev.url.href : "", prev ? prev.title : "");
        fillPagerSlot(document.querySelector("[data-next]"), next ? next.url.href : "", next ? next.title : "");
      })
      .catch(function () {});
  }

  function init() {
    var updateProgress = initProgress();
    initChapter(updateProgress);
    initShelf();
    initBlogTree();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
