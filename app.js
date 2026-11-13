/* ==========================================================================
   HELLO WORLD — Synthwave v2
   Thème, révélations au scroll, parallaxe légère et démo de terminal.
   Aucune dépendance.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Année du pied de page ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Thème Sunset / Matrix ---------- */

  var THEME_COLORS = {
    sunset: "#0b0420",
    matrix: "#031106"
  };

  var toggle = document.getElementById("theme-toggle");
  var toggleLabel = toggle ? toggle.querySelector(".theme-toggle__label") : null;
  var themeMeta = document.getElementById("theme-color");

  function applyTheme(theme, persist) {
    var next = theme === "matrix" ? "matrix" : "sunset";
    root.dataset.theme = next;

    if (toggle) {
      toggle.setAttribute("aria-pressed", String(next === "matrix"));
      toggle.setAttribute("aria-label", "Thème actuel : " + (next === "matrix" ? "Matrix" : "Sunset") + ". Cliquer pour changer.");
    }
    if (toggleLabel) {
      toggleLabel.textContent = next === "matrix" ? "Matrix" : "Sunset";
    }
    if (themeMeta) {
      themeMeta.setAttribute("content", THEME_COLORS[next]);
    }

    if (persist) {
      try {
        localStorage.setItem("sw-theme", next);
      } catch (error) { /* stockage indisponible : le thème reste valable pour la session */ }
    }
  }

  applyTheme(root.dataset.theme === "matrix" ? "matrix" : "sunset", false);

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "matrix" ? "sunset" : "matrix", true);
    });
  }

  /* ---------- Barre supérieure au scroll ---------- */

  var topbar = document.getElementById("topbar");
  var ticking = false;

  function onScroll() {
    if (!topbar) return;
    topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  onScroll();

  /* ---------- Révélations au scroll ---------- */

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealAll() {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- Parallaxe et halo du curseur ---------- */

  var scene = document.querySelector(".scene");
  var glow = document.querySelector(".cursor-glow");
  var pointerFrame = null;
  var pointerX = 0;
  var pointerY = 0;

  if (finePointer && scene) {
    document.body.classList.add("has-pointer");

    window.addEventListener("pointermove", function (event) {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (pointerFrame !== null) return;
      pointerFrame = window.requestAnimationFrame(function () {
        pointerFrame = null;

        if (!reduceMotion) {
          var nx = (pointerX / window.innerWidth - 0.5) * 2;
          var ny = (pointerY / window.innerHeight - 0.5) * 2;
          scene.style.setProperty("--px", nx.toFixed(3));
          scene.style.setProperty("--py", ny.toFixed(3));
        }

        if (glow) {
          glow.style.setProperty("--gx", pointerX + "px");
          glow.style.setProperty("--gy", pointerY + "px");
        }
      });
    }, { passive: true });

    window.addEventListener("pointerleave", function () {
      if (scene) {
        scene.style.setProperty("--px", "0");
        scene.style.setProperty("--py", "0");
      }
    });
  }

  /* ---------- Démo de terminal ---------- */

  var output = document.getElementById("terminal-output");

  if (output) {
    var lines = [
      { text: "$ npm run hello", cls: "term-line--cmd" },
      { text: "> synthwave@2.0.0 hello", cls: "term-line--dim" },
      { text: '> echo "HELLO WORLD"', cls: "term-line--dim" },
      { text: "HELLO WORLD", cls: "term-line--out" },
      { text: "✓ ready in 0.00s — zero build, zero deps", cls: "term-line--ok" }
    ];

    var cursor = document.createElement("span");
    cursor.className = "term-cursor";
    cursor.setAttribute("aria-hidden", "true");

    function renderLine(line) {
      var element = document.createElement("div");
      element.className = "term-line " + line.cls;
      element.textContent = line.text;
      output.insertBefore(element, cursor);
      return element;
    }

    function wait(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }

    function typeLine(line) {
      var element = document.createElement("div");
      element.className = "term-line " + line.cls;
      output.insertBefore(element, cursor);

      return Array.prototype.reduce.call(line.text, function (chain, character) {
        return chain.then(function () {
          element.textContent += character;
          return wait(16);
        });
      }, Promise.resolve());
    }

    var terminalStarted = false;

    function startTerminal() {
      if (terminalStarted) return;
      terminalStarted = true;

      output.textContent = "";
      output.appendChild(cursor);

      if (reduceMotion) {
        lines.forEach(renderLine);
        return;
      }

      lines.reduce(function (chain, line) {
        return chain
          .then(function () {
            return typeLine(line);
          })
          .then(function () {
            return wait(240);
          });
      }, wait(420)).catch(function () {
        /* En cas d'erreur, on affiche au moins le résultat complet. */
        output.textContent = "";
        output.appendChild(cursor);
        lines.forEach(renderLine);
      });
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      startTerminal();
    } else {
      var terminalObserver = new IntersectionObserver(function (entries) {
        if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
        terminalObserver.disconnect();
        startTerminal();
      }, { threshold: 0.25 });

      terminalObserver.observe(output);
    }
  }
})();
