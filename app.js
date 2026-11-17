/**
 * SITELABS // GRAPHITE SPECIFICATION ENGINE
 * High-Performance Blueprint Interactions & Animations
 * Vivek Chaurasiya — 29 Repositories Showcase
 */

(function () {
  "use strict";

  const root = document.documentElement;
  const projects = window.SITE_PROJECTS || [];

  // =========================================================================
  // 00. PREMIUM NAVBAR GLIDER & SCROLLSPY
  // =========================================================================
  function initNavGlider() {
    const navMenu = document.getElementById("navMenu");
    const glider = document.getElementById("navGlider");
    const topNav = document.getElementById("topNav");
    if (!navMenu || !glider) return;

    const items = Array.from(navMenu.querySelectorAll(".nv__item"));
    let isClickScrolling = false;
    let clickTimeout = null;

    function positionGlider(el) {
      if (!el) {
        glider.style.opacity = "0";
        return;
      }
      glider.style.left = el.offsetLeft + "px";
      glider.style.width = el.offsetWidth + "px";
      glider.style.opacity = "1";
    }

    function getActiveItem() {
      return navMenu.querySelector(".nv__item.is-active") || items[0];
    }

    // Hover interactions
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        positionGlider(item);
      });
      item.addEventListener("click", () => {
        isClickScrolling = true;
        clearTimeout(clickTimeout);
        items.forEach((i) => i.classList.remove("is-active"));
        item.classList.add("is-active");
        positionGlider(item);
        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 750);
      });
    });

    navMenu.addEventListener("mouseleave", () => {
      positionGlider(getActiveItem());
    });

    // Window Resize update
    window.addEventListener("resize", () => {
      positionGlider(getActiveItem());
    }, { passive: true });

    // Scroll Elevation on topNav
    window.addEventListener("scroll", () => {
      if (topNav) {
        topNav.classList.toggle("is-scrolled", window.scrollY > 20);
      }
    }, { passive: true });

    // Dynamic Scrollspy
    const sectionIds = items.map((it) => it.getAttribute("href")?.replace("#", "")).filter(Boolean);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    function updateScrollspy() {
      if (isClickScrolling) return;

      const scrollPos = window.scrollY + 200;
      let currentSectionId = null;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.id;
        }
      });

      if (currentSectionId) {
        const activeLink = navMenu.querySelector(`.nv__item[href="#${currentSectionId}"]`);
        if (activeLink && !activeLink.classList.contains("is-active")) {
          items.forEach((i) => i.classList.remove("is-active"));
          activeLink.classList.add("is-active");
          positionGlider(activeLink);
        }
      }
    }

    window.addEventListener("scroll", updateScrollspy, { passive: true });

    // Initial positioning after fonts / layout ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        positionGlider(getActiveItem());
      });
    }
    setTimeout(() => {
      positionGlider(getActiveItem());
    }, 80);
    setTimeout(() => {
      positionGlider(getActiveItem());
    }, 300);
  }

  // =========================================================================
  // 01. THEME SWITCHER
  // =========================================================================
  function initTheme() {
    const themeBtn = document.getElementById("themeToggle");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      if (themeMeta) {
        themeMeta.setAttribute("content", theme === "light" ? "#f6f6f4" : "#2e2e30");
      }
      try {
        localStorage.setItem("sitelabs-theme", theme);
      } catch (e) {}
      document.dispatchEvent(new CustomEvent("graphite:theme"));
    }

    const savedTheme = localStorage.getItem("sitelabs-theme") || "dark";
    applyTheme(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
      });
    }
  }

  // =========================================================================
  // 02. LIVE CLOCK (NEW DELHI / IST)
  // =========================================================================
  function initClock() {
    const clockEl = document.getElementById("liveClock");
    if (!clockEl) return;

    function update() {
      const now = new Date();
      // IST is UTC + 5:30
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      const timeStr = new Intl.DateTimeFormat("en-GB", options).format(now);
      clockEl.innerHTML = `<span class="clock-indicator"></span> DEL · ${timeStr} IST`;
    }

    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // 03. CUSTOM CURSOR & MAGNETIC INTERACTIONS
  // =========================================================================
  function initCursor() {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hover scale effect on links, buttons and cards
    const hoverables = "a, button, .wk__cell, .nm__cell, .sv__tab, .chip, .mx__row, .term-dot";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) {
        ring.style.width = "54px";
        ring.style.height = "54px";
        ring.style.borderColor = "var(--accent-amber)";
        ring.style.backgroundColor = "rgba(252, 185, 0, 0.06)";
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) {
        ring.style.width = "32px";
        ring.style.height = "32px";
        ring.style.borderColor = "var(--mute)";
        ring.style.backgroundColor = "transparent";
      }
    });
  }

  // =========================================================================
  // 04. MECHANICAL ROLLING DIGIT ODOMETER (NUMBERS SECTION)
  // =========================================================================
  function initNumbers() {
    const section = document.getElementById("numbers");
    if (!section) return;

    const cells = section.querySelectorAll(".nm__cell");

    function spinDigits() {
      cells.forEach((cell) => {
        const digits = cell.querySelectorAll(".nm__d");
        digits.forEach((d) => {
          const target = parseInt(d.getAttribute("data-digit") || "0", 10);
          const drum = d.querySelector(".nm__drum");
          if (drum) {
            // Each digit takes 1em height
            drum.style.transform = `translateY(-${target * 10}%)`;
          }
        });

        // Trigger progress bar
        const bar = cell.querySelector(".nm__bar");
        if (bar) {
          const targetW = bar.getAttribute("data-bar") || "100";
          bar.style.setProperty("--w", targetW + "%");
        }
      });
    }

    function resetDigits() {
      cells.forEach((cell) => {
        const drums = cell.querySelectorAll(".nm__drum");
        drums.forEach((drum) => {
          drum.style.transform = "translateY(0%)";
        });
      });
    }

    // Spin on intersection observer
    let hasSpun = false;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!hasSpun) {
            hasSpun = true;
            setTimeout(spinDigits, 150);
          }
        }
      }, { threshold: 0.25 });
      observer.observe(section);
    } else {
      spinDigits();
    }

    // Re-spin on user click
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        cells.forEach((c) => c.classList.toggle("is-on", c === cell));
        resetDigits();
        setTimeout(spinDigits, 80);
      });
    });
  }

  // =========================================================================
  // 05. SIX CRAFTS ACCORDION (AUTO-PLAYING + TILT)
  // =========================================================================
  function initPillarsAccordion() {
    const sec = document.getElementById("pillars");
    if (!sec) return;

    const strips = Array.from(sec.querySelectorAll(".sv__strip"));
    const idxEl = sec.querySelector(".sv__idx");
    const modeEl = sec.querySelector(".sv__mode");
    const pauseBtn = document.getElementById("svPauseBtn");

    let currentIndex = 0;
    let isPaused = false;
    let timer = null;
    const intervalTime = 5200;

    function openStrip(idx) {
      if (idx < 0 || idx >= strips.length) return;
      currentIndex = idx;
      strips.forEach((strip, k) => {
        const isOpen = k === idx;
        strip.classList.toggle("is-open", isOpen);
        const tab = strip.querySelector(".sv__tab");
        if (tab) tab.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      if (idxEl) {
        idxEl.textContent = (idx + 1 < 10 ? "0" : "") + (idx + 1);
      }
    }

    function startAutoLoop() {
      if (isPaused) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isPaused) {
          openStrip((currentIndex + 1) % strips.length);
          startAutoLoop();
        }
      }, intervalTime);
    }

    function togglePause(forcedState) {
      isPaused = typeof forcedState === "boolean" ? forcedState : !isPaused;
      sec.classList.toggle("is-paused", isPaused);
      if (pauseBtn) {
        pauseBtn.textContent = isPaused ? "PLAY" : "PAUSE";
      }
      if (modeEl) {
        modeEl.textContent = isPaused ? "PAUSED" : "AUTOPLAY";
      }
      if (!isPaused) {
        startAutoLoop();
      } else {
        clearTimeout(timer);
      }
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => togglePause());
    }

    strips.forEach((strip, i) => {
      const tab = strip.querySelector(".sv__tab");
      if (tab) {
        tab.addEventListener("click", () => {
          openStrip(i);
          togglePause(true);
        });
      }

      strip.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 992) {
          openStrip(i);
          togglePause(true);
        }
      });

      // 3D tilt tracking
      strip.addEventListener("mousemove", (ev) => {
        if (!strip.classList.contains("is-open")) return;
        const rect = strip.getBoundingClientRect();
        const px = ((ev.clientX - rect.left) / rect.width - 0.5).toFixed(3);
        const py = ((ev.clientY - rect.top) / rect.height - 0.5).toFixed(3);
        strip.style.setProperty("--px", px);
        strip.style.setProperty("--py", py);
      });
    });

    sec.addEventListener("mouseleave", () => {
      togglePause(false);
    });

    startAutoLoop();
  }

  // =========================================================================
  // 06. SELECTED WORK BLUEPRINT GRID (FILTERS, SEARCH, CROSSHAIR HUD)
  // =========================================================================
  function initWorkGrid() {
    const sec = document.getElementById("work");
    if (!sec) return;

    const grid = document.getElementById("projectsGrid");
    const cells = Array.from(sec.querySelectorAll(".wk__cell"));
    const chips = Array.from(sec.querySelectorAll(".chips .chip"));
    const cols = Array.from(sec.querySelectorAll(".wk__cols span"));
    const rows = Array.from(sec.querySelectorAll(".wk__rows span"));
    const readout = document.getElementById("wkReadout");
    const searchInput = document.getElementById("projectSearchInput");
    const searchClear = document.getElementById("searchClearBtn");
    const searchCount = document.getElementById("searchMatchCount");

    let activeFilter = "all";
    let searchQuery = "";

    function filterProjects() {
      let matches = 0;
      cells.forEach((cell) => {
        const cat = cell.getAttribute("data-cat");
        const name = (cell.getAttribute("data-id") || "").toLowerCase();
        const text = cell.textContent.toLowerCase();

        const matchCat = activeFilter === "all" || cat === activeFilter;
        const matchSearch = !searchQuery || name.includes(searchQuery) || text.includes(searchQuery);

        const isVisible = matchCat && matchSearch;
        cell.classList.toggle("is-dim", !isVisible);
        if (isVisible) matches++;
      });

      if (searchCount) {
        searchCount.textContent = `${matches} / ${cells.length}`;
      }
    }

    // Filter Chips
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        activeFilter = chip.getAttribute("data-filter") || "all";
        chips.forEach((c) => {
          const on = c === chip;
          c.classList.toggle("is-on", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        filterProjects();
      });
    });

    // Real-Time Search
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (searchClear) {
          searchClear.classList.toggle("is-visible", searchQuery.length > 0);
        }
        filterProjects();
      });
    }

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = "";
          searchQuery = "";
          searchClear.classList.remove("is-visible");
          filterProjects();
          searchInput.focus();
        }
      });
    }

    // Crosshair Tracking on Wide Screens
    if (grid && readout) {
      const colLabels = ["A", "B", "C", "D"];

      grid.addEventListener("mousemove", (ev) => {
        if (window.innerWidth < 1100) return;
        const rect = grid.getBoundingClientRect();
        const x = Math.max(0, ev.clientX - rect.left);
        const y = Math.max(0, ev.clientY - rect.top);

        const colWidth = rect.width / 4;
        const colIdx = Math.min(3, Math.floor(x / colWidth));
        const rowHeight = rect.height / 8;
        const rowIdx = Math.min(7, Math.floor(y / rowHeight));

        const cellCoord = `${colLabels[colIdx]}${rowIdx + 1}`;
        const pad4 = (n) => String(n).padStart(4, "0");
        readout.textContent = `X ${pad4(Math.round(x))} · Y ${pad4(Math.round(y))} · CELL ${cellCoord}`;

        // Highlight active headers & band
        cols.forEach((c, i) => c.classList.toggle("is-on", i === colIdx));
        rows.forEach((r, i) => r.classList.toggle("is-on", i === rowIdx));

        cells.forEach((cell) => {
          const c = parseInt(cell.getAttribute("data-col"), 10);
          const r = parseInt(cell.getAttribute("data-row"), 10);
          cell.classList.toggle("is-band", c === colIdx || r === rowIdx);
        });
      });

      grid.addEventListener("mouseleave", () => {
        cols.forEach((c) => c.classList.remove("is-on"));
        rows.forEach((r) => r.classList.remove("is-on"));
        cells.forEach((cell) => cell.classList.remove("is-band"));
        readout.textContent = `X 0000 · Y 0000 · CELL --`;
      });
    }
  }

  // =========================================================================
  // 07. BLUEPRINT INSPECTOR MODAL DRAWER
  // =========================================================================
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBlueprintId = document.getElementById("modalBlueprintId");
  const modalCategory = document.getElementById("modalCategory");
  const modalBadge = document.getElementById("modalBadge");
  const modalMetric = document.getElementById("modalMetric");
  const modalDescription = document.getElementById("modalDescription");
  const modalCloneCommand = document.getElementById("modalCloneCommand");
  const modalCloneCopyBtn = document.getElementById("modalCloneCopyBtn");
  const modalLanguage = document.getElementById("modalLanguage");
  const modalStarsForks = document.getElementById("modalStarsForks");
  const modalUpdated = document.getElementById("modalUpdated");
  const modalTopics = document.getElementById("modalTopics");
  const modalGithubLink = document.getElementById("modalGithubLink");
  const modalDemoLink = document.getElementById("modalDemoLink");
  const modalCoverContainer = document.getElementById("modalCoverContainer");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  window.openProjectModal = function (projectName) {
    const proj = projects.find((p) => p.name === projectName);
    if (!proj || !modal) return;

    modalTitle.textContent = proj.name;
    modalBlueprintId.textContent = proj.blueprint_id;
    modalCategory.textContent = proj.category.toUpperCase();
    modalBadge.textContent = proj.is_fork ? "FORK / EXTENDED" : "ORIGINAL SOURCE";
    modalBadge.className = `badge badge--${proj.category}`;
    modalMetric.textContent = `KEY BENCHMARK: ${proj.metric}`;
    modalDescription.textContent = proj.description;

    const cloneStr = `git clone ${proj.github_url}.git`;
    modalCloneCommand.textContent = cloneStr;
    modalLanguage.textContent = proj.language;
    modalStarsForks.textContent = `${proj.stars} Stars · ${proj.forks} Forks`;
    modalUpdated.textContent = proj.updated_at;

    // Topics pills
    modalTopics.innerHTML = "";
    if (proj.topics && proj.topics.length > 0) {
      proj.topics.forEach((t) => {
        const span = document.createElement("span");
        span.className = "badge";
        span.textContent = t;
        modalTopics.appendChild(span);
      });
    } else {
      modalTopics.innerHTML = `<span class="badge">${proj.language}</span>`;
    }

    // Cover SVG
    if (modalCoverContainer && proj.svg) {
      modalCoverContainer.innerHTML = proj.svg;
    }

    // Links
    modalGithubLink.href = proj.github_url;
    if (proj.demo_url) {
      modalDemoLink.href = proj.demo_url;
      modalDemoLink.style.display = "inline-flex";
    } else {
      modalDemoLink.style.display = "none";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Copy Clone Command
  if (modalCloneCopyBtn) {
    modalCloneCopyBtn.addEventListener("click", () => {
      const text = modalCloneCommand.textContent;
      navigator.clipboard.writeText(text).then(() => {
        modalCloneCopyBtn.textContent = "COPIED!";
        setTimeout(() => {
          modalCloneCopyBtn.textContent = "COPY";
        }, 1800);
      });
    });
  }

  // Quick navigation filter helper from Pillars
  window.filterByProject = function (name) {
    const searchInput = document.getElementById("projectSearchInput");
    if (searchInput) {
      searchInput.value = name;
      searchInput.dispatchEvent(new Event("input"));
    }
    const target = document.getElementById("work");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // =========================================================================
  // 08. ENGINEERING TIMELINE LIFECYCLE (INTERACTIVE SCRUBBER)
  // =========================================================================
  function initTimeline() {
    const sec = document.getElementById("lifecycle");
    if (!sec) return;

    const chart = document.getElementById("timelineChart");
    const playhead = document.getElementById("timelinePlayhead");
    const weeks = Array.from(sec.querySelectorAll(".pc__weeks span"));
    const tag = document.getElementById("pcCurrentTag");
    const wk = document.getElementById("pcCurrentWk");
    const name = document.getElementById("pcCurrentName");
    const team = document.getElementById("pcCurrentTeam");
    const pauseBtn = document.getElementById("pcPauseBtn");

    const phases = [
      { a: 0, b: 2, name: "Domain Architecture & Threat Models", team: "SYSTEM SPEC · THREAT MATRIX · SCHEMAS" },
      { a: 2, b: 5, name: "Multi-Agent State Graphs & RAG", team: "LANGGRAPH · CHROMADB · GROQ INFERENCE" },
      { a: 5, b: 8, name: "Distributed Backend & Real-Time Sockets", team: "NODE.JS · WEBSOCKETS · ARENA SANDBOX" },
      { a: 8, b: 10, name: "Precision Design System & Micro-Interactions", team: "EDITORIAL GRAPHITE UI · MANROPE · KERNEL CSS" },
      { a: 10, b: 12, name: "Evidence-Backed Verification & Release", team: "END-TO-END BENCHMARKS · CI/CD · GLOBAL DEPLOY" }
    ];

    let p = 3.6; // starts at W04
    let isPlaying = true;
    let isDragging = false;
    let animFrame = null;

    function render(val) {
      p = Math.max(0, Math.min(11.99, val));
      const currentWeek = Math.floor(p);
      const day = Math.floor((p % 1) * 5) + 1;
      const weekLabel = "W" + String(currentWeek + 1).padStart(2, "0");

      if (playhead) {
        // Timeline percentage across 12 weeks
        const pct = (p / 12) * 100;
        playhead.style.left = `${pct}%`;
        playhead.setAttribute("aria-valuenow", p.toFixed(1));
      }

      weeks.forEach((w, i) => {
        w.classList.toggle("is-on", i === currentWeek);
      });

      const activePhase = phases.find((ph) => p >= ph.a && p < ph.b) || phases[0];
      if (tag) tag.textContent = `NOW · ${weekLabel} · DAY ${day}`;
      if (wk) wk.textContent = weekLabel;
      if (name) name.textContent = activePhase.name;
      if (team) team.textContent = activePhase.team;
    }

    function loop() {
      if (isPlaying && !isDragging) {
        p = (p + 0.015) % 12;
        render(p);
      }
      animFrame = requestAnimationFrame(loop);
    }
    animFrame = requestAnimationFrame(loop);

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        isPlaying = !isPlaying;
        pauseBtn.textContent = isPlaying ? "PAUSE TIMELINE" : "RESUME TIMELINE";
      });
    }

    // Pointer Scrubbing
    function scrubFromPointer(ev) {
      const rect = chart.getBoundingClientRect();
      const cornerEl = chart.querySelector(".pc__corner");
      const cornerWidth = cornerEl ? cornerEl.offsetWidth : 280;
      const activeWidth = Math.max(10, rect.width - cornerWidth);
      const clientX = ev.clientX - rect.left - cornerWidth;
      const fraction = Math.max(0, Math.min(1, clientX / activeWidth));
      render(fraction * 12);
    }

    chart.addEventListener("pointerdown", (e) => {
      isDragging = true;
      chart.setPointerCapture(e.pointerId);
      scrubFromPointer(e);
    });

    chart.addEventListener("pointermove", (e) => {
      if (isDragging) scrubFromPointer(e);
    });

    chart.addEventListener("pointerup", (e) => {
      isDragging = false;
      try {
        chart.releasePointerCapture(e.pointerId);
      } catch (err) {}
    });

    // Keyboard navigation
    if (playhead) {
      playhead.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          render(p + 1);
          e.preventDefault();
        } else if (e.key === "ArrowLeft") {
          render(p - 1);
          e.preventDefault();
        }
      });
    }

    render(p);
  }

  // =========================================================================
  // 09. SYSTEM MATRIX TABLE FILTERS
  // =========================================================================
  function initMatrix() {
    const sec = document.getElementById("matrix");
    if (!sec) return;

    const pills = Array.from(sec.querySelectorAll(".mx__filter-pills .pill"));
    const rows = Array.from(sec.querySelectorAll(".mx__row"));

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");

        const targetCat = pill.getAttribute("data-mx-cat");
        rows.forEach((r) => {
          const cat = r.getAttribute("data-cat");
          if (targetCat === "all" || cat === targetCat) {
            r.style.display = "";
          } else {
            r.style.display = "none";
          }
        });
      });
    });
  }

  // =========================================================================
  // 10. DEVELOPER TERMINAL SANDBOX
  // =========================================================================
  function initTerminal() {
    const input = document.getElementById("terminalInput");
    const output = document.getElementById("terminalOutput");
    const body = document.getElementById("terminalBody");
    if (!input || !output || !body) return;

    const history = [];
    let historyIdx = -1;

    function appendLine(text, isCommand = false, isDim = false) {
      const p = document.createElement("p");
      p.className = isCommand ? "term__msg" : isDim ? "term__dim" : "term__msg";
      p.innerHTML = text;
      output.appendChild(p);
      body.scrollTop = body.scrollHeight;
    }

    function processCommand(raw) {
      const cmd = raw.trim();
      if (!cmd) return;

      history.push(cmd);
      historyIdx = history.length;

      appendLine(`vivek@sitelabs:~$ <span style="color:#f4f4f2">${cmd}</span>`, true);

      const parts = cmd.split(" ");
      const action = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ").trim();

      switch (action) {
        case "help":
          appendLine("Available commands:");
          appendLine("  <strong>ls</strong>               - List all 29 repositories");
          appendLine("  <strong>info &lt;repo&gt;</strong>        - Inspect repository blueprint");
          appendLine("  <strong>filter &lt;category&gt;</strong>  - Filter by ai, backend, fullstack, security, civic");
          appendLine("  <strong>stats</strong>            - Show repository metrics & stack breakdown");
          appendLine("  <strong>clone &lt;repo&gt;</strong>       - Generate Git clone snippet");
          appendLine("  <strong>clear</strong>            - Clear screen");
          break;

        case "ls":
        case "list":
          appendLine(`INDEXED REPOSITORIES (${projects.length}):`, false, true);
          projects.forEach((p) => {
            appendLine(`  [${p.blueprint_id}] <strong>${p.name}</strong> (${p.category.toUpperCase()} // ${p.language})`);
          });
          break;

        case "info":
        case "cat":
          if (!arg) {
            appendLine("Usage: info &lt;repository-name&gt; (e.g. info Meridian-AI)");
          } else {
            const found = projects.find((p) => p.name.toLowerCase() === arg.toLowerCase());
            if (found) {
              appendLine(`== <strong>${found.name}</strong> [${found.blueprint_id}] ==`);
              appendLine(`Domain:   ${found.category.toUpperCase()}`);
              appendLine(`Stack:    ${found.language}`);
              appendLine(`Metric:   ${found.metric}`);
              appendLine(`Summary:  ${found.description}`);
              appendLine(`URL:      <a href="${found.github_url}" target="_blank" style="color:var(--accent-amber)">${found.github_url}</a>`);
              if (found.demo_url) {
                appendLine(`Demo:     <a href="${found.demo_url}" target="_blank" style="color:var(--accent-green)">${found.demo_url}</a>`);
              }
            } else {
              appendLine(`Error: Repository '${arg}' not found in catalog.`);
            }
          }
          break;

        case "filter":
          if (!arg) {
            appendLine("Usage: filter &lt;ai|backend|fullstack|security|civic&gt;");
          } else {
            const matches = projects.filter((p) => p.category.toLowerCase() === arg.toLowerCase());
            appendLine(`Found ${matches.length} matches in '${arg}':`, false, true);
            matches.forEach((p) => {
              appendLine(`  • <strong>${p.name}</strong> - ${p.metric}`);
            });
          }
          break;

        case "stats":
          const cats = {};
          projects.forEach((p) => {
            cats[p.category] = (cats[p.category] || 0) + 1;
          });
          appendLine("REPOSITORIES BREAKDOWN:");
          Object.keys(cats).forEach((k) => {
            appendLine(`  ${k.toUpperCase().padEnd(12)}: ${cats[k]} projects`);
          });
          appendLine(`TOTAL: ${projects.length} verified projects`);
          break;

        case "clone":
          if (!arg) {
            appendLine("Usage: clone &lt;repository-name&gt;");
          } else {
            const proj = projects.find((p) => p.name.toLowerCase() === arg.toLowerCase());
            if (proj) {
              appendLine(`$ git clone ${proj.github_url}.git`);
            } else {
              appendLine(`Error: Project '${arg}' not recognized.`);
            }
          }
          break;

        case "clear":
          output.innerHTML = "";
          break;

        default:
          appendLine(`Command not recognized: '${cmd}'. Type <strong>help</strong> for options.`);
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value;
        input.value = "";
        processCommand(val);
      } else if (e.key === "ArrowUp") {
        if (history.length > 0 && historyIdx > 0) {
          historyIdx--;
          input.value = history[historyIdx];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (history.length > 0 && historyIdx < history.length - 1) {
          historyIdx++;
          input.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          input.value = "";
        }
        e.preventDefault();
      }
    });

    // Quick tap command chips (especially for mobile touchscreens)
    const quickBtns = document.querySelectorAll(".term__quick-btn");
    quickBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-cmd");
        if (cmd) {
          processCommand(cmd);
          if (output) output.scrollTop = output.scrollHeight;
        }
      });
    });
  }

  // =========================================================================
  // 10. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function initMobileNav() {
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const drawer = document.getElementById("mobileNavDrawer");
    const backdrop = document.getElementById("mobileNavBackdrop");
    const closeBtn = document.getElementById("mobileNavCloseBtn");
    if (!mobileBtn || !drawer) return;

    function openMobileDrawer() {
      drawer.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      mobileBtn.classList.add("is-active");
      mobileBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    }

    function closeMobileDrawer() {
      drawer.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      mobileBtn.classList.remove("is-active");
      mobileBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }

    mobileBtn.addEventListener("click", () => {
      if (drawer.classList.contains("is-open")) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeMobileDrawer);
    if (backdrop) backdrop.addEventListener("click", closeMobileDrawer);

    // Close when a link inside mobile drawer is tapped
    const mobileLinks = drawer.querySelectorAll(".nv-mobile-link");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileDrawer();
      });
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeMobileDrawer();
      }
    });
  }

  // =========================================================================
  // AUTHENTIC GRAPHITE HERO COFFEE STEAM & DESK MOTION
  // =========================================================================
  const PUFFS = [
    [83, 325, 28, 35], [98, 318, 28, 35], [122, 317, 30, 37], [126, 319, 30, 37], [62, 323, 22, 27],
    [136, 314, 28, 35], [80, 319, 24, 30], [67, 325, 28, 35], [118, 322, 22, 27], [131, 315, 28, 35],
    [109, 316, 22, 27], [73, 312, 22, 27], [120, 329, 24, 30], [105, 327, 28, 35], [81, 313, 24, 30],
    [122, 314, 24, 30], [87, 330, 24, 30], [71, 329, 22, 27]
  ];

  function steamSvg() {
    const puffs = PUFFS.map((p) => {
      return `<ellipse class="hd__puff" cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[3]}"/>`;
    }).join("");
    return `<svg viewBox="0 0 200 400" focusable="false" aria-hidden="true"><defs>` +
      `<radialGradient id="steam-puff"><stop class="hd__stop" offset="0"/><stop class="hd__stop hd__stop--end" offset="1"/></radialGradient>` +
      `<filter id="steam-wisps" x="-50%" y="-20%" width="200%" height="140%">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.016 0.024" numOctaves="3" seed="4" result="noise">` +
      `<animate attributeName="baseFrequency" dur="14s" values="0.016 0.024;0.019 0.028;0.014 0.021;0.016 0.024" repeatCount="indefinite"/>` +
      `</feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="48" xChannelSelector="R" yChannelSelector="G" result="torn"/>` +
      `<feGaussianBlur in="torn" stdDeviation="5"/></filter></defs>` +
      `<ellipse class="hd__haze" cx="100" cy="326" rx="62" ry="54"/><g class="hd__puffs">${puffs}</g></svg>`;
  }

  function initSteam() {
    const header = document.querySelector(".hd");
    if (!header) return;

    let steam = header.querySelector(".hd__steam");
    if (!steam) {
      steam = document.createElement("div");
      steam.className = "hd__steam";
      steam.setAttribute("aria-hidden", "true");
      steam.innerHTML = steamSvg();
      header.appendChild(steam);
    }

    function place() {
      const w = header.offsetWidth;
      const h = header.offsetHeight;
      const s = Math.max(w / 2560, h / 1240);
      const cup = [370, 1102]; // Exact coffee cup center coordinates on 2560x1240 canvas
      const x = (cup[0] - 1280) * s + w / 2;
      const y = cup[1] * s;
      steam.style.setProperty("--ss", s + "px");
      steam.style.setProperty("--steam-x", x.toFixed(1) + "px");
      steam.style.setProperty("--steam-y", y.toFixed(1) + "px");
      steam.classList.toggle("is-off", x < 40 * s || x > w - 40 * s || window.innerWidth <= 768);
    }

    window.addEventListener("resize", place, { passive: true });
    document.addEventListener("graphite:theme", place);
    place();
  }

  function initHeroParallax() {
    const header = document.querySelector(".hd");
    const studio = document.querySelector(".hd__studio");
    if (!header || !studio || window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    header.addEventListener("mousemove", (e) => {
      const rect = header.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = nx * 10;
      targetY = ny * 8;
    }, { passive: true });

    header.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
    });

    function loop() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (window.innerWidth > 1100) {
        studio.style.transform = `translateX(-50%) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      } else {
        studio.style.transform = "none";
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // =========================================================================
  // BOOTSTRAP ALL MODULES
  // =========================================================================
  function init() {
    initNavGlider();
    initMobileNav();
    initTheme();
    initSteam();
    initHeroParallax();
    initClock();
    initCursor();
    initNumbers();
    initPillarsAccordion();
    initWorkGrid();
    initTimeline();
    initMatrix();
    initTerminal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

