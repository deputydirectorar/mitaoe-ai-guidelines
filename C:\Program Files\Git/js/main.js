/* ============================================================
   MITAOE — Teaching, Learning and Research in the Age of Ethical AI
   UI behaviour v2.0
   ============================================================ */
(function () {
  'use strict';

  /* ── TAB SWITCHING ──────────────────────────────────────── */
  window.switchTab = function (tabName) {
    // Hide all tab content panels
    document.querySelectorAll('.tab-content').forEach(function (panel) {
      panel.classList.add('hidden');
      panel.classList.remove('active');
    });
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });
    // Hide all TOC panels
    document.querySelectorAll('.toc-panel').forEach(function (toc) {
      toc.classList.add('hidden');
    });

    // Show selected tab
    var panel = document.getElementById('tab-' + tabName);
    if (panel) {
      panel.classList.remove('hidden');
      panel.classList.add('active');
    }
    // Activate selected tab button
    var btn = document.querySelector('[data-tab="' + tabName + '"]');
    if (btn) btn.classList.add('active');

    // Show matching TOC
    var toc = document.getElementById('toc-' + tabName);
    if (toc) toc.classList.remove('hidden');

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash without scrolling
    if (history.replaceState) {
      history.replaceState(null, null, '#' + tabName);
    }
  };

  /* ── Mobile burger ─────────────────────────────────────── */
  var burger  = document.getElementById('burger');
  var tabBar  = document.querySelector('.tab-bar');
  if (burger && tabBar) {
    burger.addEventListener('click', function () {
      tabBar.classList.toggle('mobile-open');
    });
  }

  /* ── Scroll-to-top ─────────────────────────────────────── */
  var backtop = document.getElementById('backtop');
  if (backtop) {
    window.addEventListener('scroll', function () {
      backtop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    backtop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Scroll-spy for sidebar TOC ────────────────────────── */
  function runScrollSpy () {
    var activeTab  = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    var sections   = Array.from(activeTab.querySelectorAll('section[id]'));
    var activeToc  = document.querySelector('.toc-panel:not(.hidden)');
    if (!activeToc) return;
    var tocLinks   = Array.from(activeToc.querySelectorAll('a[href^="#"]'));
    var current    = '';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 120) current = s.id;
    });
    tocLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', runScrollSpy, { passive: true });

  /* ── Print button ──────────────────────────────────────── */
  var printBtn = document.getElementById('btn-print');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  /* ══════════════════════════════════════════════════════════
     ETHICS SCENARIO GAME
     ══════════════════════════════════════════════════════════ */

  /* Reveal analysis for a chosen answer */
  window.revealAnalysis = function (scenarioNum, choice) {
    var analysisEl = document.getElementById('analysis-' + scenarioNum);
    if (!analysisEl) return;

    // Highlight selected button
    var scEl = analysisEl.closest('.scenario');
    if (scEl) {
      scEl.querySelectorAll('.sc-btn').forEach(function (b, i) {
        var opts = ['A', 'B', 'C'];
        if (opts[i] === choice) b.classList.add('selected');
        b.disabled = true;
      });
    }

    // Show ALL verdict labels then hide all, then show correct one
    // Actually show all three, let CSS classes do the work
    analysisEl.classList.remove('hidden');
    analysisEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  /* Go back to previous scenario */
  window.prevScenario = function (prev) {
    // Hide current
    var current = document.querySelector('.scenario.active');
    if (current) {
      current.classList.remove('active');
      current.classList.add('hidden');
    }
    // Show previous — reset it to a clean state so user can re-answer
    var prevEl = document.querySelector('.scenario[data-scenario="' + prev + '"]');
    if (prevEl) {
      prevEl.classList.remove('hidden');
      prevEl.classList.add('active');
      // Re-enable choice buttons and clear selection
      prevEl.querySelectorAll('.sc-btn').forEach(function (b) {
        b.disabled = false;
        b.classList.remove('selected');
      });
      // Hide analysis panel
      var analysisEl = prevEl.querySelector('.sc-analysis');
      if (analysisEl) analysisEl.classList.add('hidden');
      prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* Advance to next scenario */
  window.nextScenario = function (next) {
    // Hide current
    var current = document.querySelector('.scenario.active');
    if (current) {
      current.classList.remove('active');
      current.classList.add('hidden');
    }
    // Show next
    var nextEl = document.querySelector('.scenario[data-scenario="' + next + '"]');
    if (nextEl) {
      nextEl.classList.remove('hidden');
      nextEl.classList.add('active');
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* Reset all scenarios */
  window.resetScenarios = function () {
    document.querySelectorAll('.scenario').forEach(function (sc, idx) {
      sc.classList.remove('active', 'hidden');
      if (idx === 0) {
        sc.classList.add('active');
      } else {
        sc.classList.add('hidden');
      }
      // Re-enable buttons
      sc.querySelectorAll('.sc-btn').forEach(function (b) {
        b.disabled = false;
        b.classList.remove('selected');
      });
      // Hide analysis
      var analysisEl = sc.querySelector('.sc-analysis');
      if (analysisEl) analysisEl.classList.add('hidden');
    });
    var game = document.getElementById('scenario-game');
    if (game) game.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── Handle initial tab from URL hash ───────────────────── */
  var hash = window.location.hash.replace('#', '');
  var validTabs = ['teachers', 'students', 'research', 'ethics'];
  if (hash && validTabs.indexOf(hash) !== -1) {
    switchTab(hash);
  } else {
    // Default: show teachers tab
    switchTab('teachers');
  }

}());
