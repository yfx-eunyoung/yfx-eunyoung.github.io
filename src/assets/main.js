/* yfxlabs.dev — site interactions (homepage + shared nav/theme/menu)
   scroll parallax + frame counter, nav progress, mouse 3D, latest-feed rotation,
   R&D gallery tilt, card tilt, theme toggle with circular reveal, mobile menu/tabs/carousels. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var mqMobile = window.matchMedia('(max-width: 720px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cl = function (v) { return Math.max(0, Math.min(1, v)); };
  var setVar = function (el, k, v) { el.style.setProperty(k, String(v)); };

  /* ── theme ── */
  function currentTheme() { return root.dataset.theme === 'light' ? 'light' : 'dark'; }
  function applyTheme(t) {
    root.dataset.theme = t;
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#EEEBE3' : '#0D0E0B');
    try { localStorage.setItem('yfx-theme', t); } catch (e) {}
  }
  applyTheme(currentTheme());
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      if (e.clientX || e.clientY) {
        setVar(root, '--vt-x', e.clientX + 'px');
        setVar(root, '--vt-y', e.clientY + 'px');
      } else {
        var r = btn.getBoundingClientRect();
        setVar(root, '--vt-x', (r.left + r.width / 2) + 'px');
        setVar(root, '--vt-y', (r.top + r.height / 2) + 'px');
      }
      if (!document.startViewTransition || reduce) { applyTheme(next); return; }
      document.startViewTransition(function () { applyTheme(next); });
    });
  });

  /* ── scroll: hero parallax, frame counter, page progress, gallery spread ── */
  var hero = $('[data-hero]');
  var gal = $('[data-gallery]');
  var raf = 0;
  function measure() {
    raf = 0;
    var vh = window.innerHeight || 800;
    if (hero) {
      var hr = hero.getBoundingClientRect();
      var p = cl(-hr.top / Math.max(1, hr.height));
      setVar(root, '--hero-p', p.toFixed(4));
      setVar(root, '--f', Math.round(1 + p * 239));
    }
    if (gal) {
      var gr = gal.getBoundingClientRect();
      var gp = cl((vh - gr.top) / Math.max(1, vh + gr.height));
      setVar(root, '--rnd-s', ((gp - 0.5) * 2).toFixed(3));
    }
    var max = document.documentElement.scrollHeight - vh;
    setVar(root, '--page-p', cl(window.scrollY / Math.max(1, max)).toFixed(4));
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(measure); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  measure();

  /* ── hero mouse 3D ── */
  var hoverFeed = false;
  if (hero) {
    hero.addEventListener('mousemove', function (e) {
      hoverFeed = true;
      var r = hero.getBoundingClientRect();
      setVar(root, '--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      setVar(root, '--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    hero.addEventListener('mouseleave', function () {
      hoverFeed = false;
      setVar(root, '--mx', 0);
      setVar(root, '--my', 0);
    });
  }

  /* ── latest feed (desktop viewport) ── */
  var feed = [];
  try { feed = JSON.parse(($('#feed-data') || {}).textContent || '[]'); } catch (e) {}
  var li = 0;
  var entry = $('.vp-entry');
  function showLatest(i) {
    if (!feed.length || !entry) return;
    li = i;
    var f = feed[i];
    $$('[data-l]').forEach(function (el) {
      var k = el.getAttribute('data-l');
      if (k === 'href') el.setAttribute('href', f.href);
      else if (k === 'pat') el.className = 'vp-art ' + f.pat;
      else if (k === 'code') { el.className = 'chip ' + f.chip; el.textContent = f.code; }
      else if (k === 'idx') el.textContent = (i + 1) + ' / ' + feed.length;
      else el.textContent = f[k];
    });
    $$('[data-pick]').forEach(function (b, j) { b.setAttribute('aria-current', String(j === i)); });
    entry.classList.remove('swap'); void entry.offsetWidth; entry.classList.add('swap');
  }
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () { showLatest(+b.getAttribute('data-pick')); });
  });
  if (!reduce && feed.length > 1) {
    setInterval(function () {
      if (!hoverFeed && !document.hidden && !mqMobile.matches) showLatest((li + 1) % feed.length);
    }, 6000);
  }

  /* ── R&D gallery mouse tilt ── */
  if (gal) {
    gal.addEventListener('mousemove', function (e) {
      var r = gal.getBoundingClientRect();
      setVar(root, '--gx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      setVar(root, '--gy', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    gal.addEventListener('mouseleave', function () { setVar(root, '--gx', 0); setVar(root, '--gy', 0); });
  }

  /* ── resource card hover tilt ── */
  $$('[data-tilt]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      setVar(el, '--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      setVar(el, '--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    el.addEventListener('mouseleave', function () { setVar(el, '--tx', 0); setVar(el, '--ty', 0); });
  });

  /* ── copy VEX ── */
  var copyBtn = $('[data-copy]');
  if (copyBtn) {
    var copyT;
    copyBtn.addEventListener('click', function () {
      var text = ($('[data-code]').innerText || '').replace(/\n+$/, '');
      var done = function () {
        $('[data-copy-label]').textContent = 'Copied';
        $('[data-copy-label-m]').textContent = 'Copied';
        clearTimeout(copyT);
        copyT = setTimeout(function () {
          $('[data-copy-label]').textContent = 'Copy VEX';
          $('[data-copy-label-m]').textContent = 'Copy';
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else done();
    });
  }

  /* ── mobile: hrefs that point at desktop-only anchors ── */
  function syncHrefs() {
    $$('[data-mhref]').forEach(function (a) {
      if (!a.dataset.dhref) a.dataset.dhref = a.getAttribute('href');
      a.setAttribute('href', mqMobile.matches ? a.dataset.mhref : a.dataset.dhref);
    });
  }
  syncHrefs();
  (mqMobile.addEventListener ? mqMobile.addEventListener.bind(mqMobile, 'change') : mqMobile.addListener.bind(mqMobile))(function () {
    syncHrefs(); updateFlow(); if (!mqMobile.matches) closeMenu();
  });

  /* ── mobile menu sheet ── */
  var sheet = $('#menu-sheet');
  var openBtn = $('[data-menu-open]');
  function openMenu() {
    if (!sheet) return;
    sheet.hidden = false;
    openBtn && openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var c = $('[data-menu-close]'); c && c.focus();
  }
  function closeMenu(restoreFocus) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    openBtn && openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus && openBtn) openBtn.focus();
  }
  openBtn && openBtn.addEventListener('click', openMenu);
  var closeBtn = $('[data-menu-close]');
  closeBtn && closeBtn.addEventListener('click', function () { closeMenu(true); });
  $$('[data-menu-link]').forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
  sheet && sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(true); });

  /* ── mobile tabs ── */
  var tabs = $$('[data-tab]');
  var tabName = $('[data-tab-name]');
  function selectTab(i, focus) {
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (tabName) tabName.textContent = tabs[i].textContent;
    var viewAll = $('[data-view-all]');
    if (viewAll && tabs[i].dataset.href) viewAll.setAttribute('href', tabs[i].dataset.href);
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') selectTab((i + 1) % tabs.length, true);
      if (e.key === 'ArrowLeft') selectTab((i - 1 + tabs.length) % tabs.length, true);
    });
  });

  /* ── mobile latest carousel ── */
  var track = $('[data-mlatest]');
  var mdots = $$('[data-mpick]');
  if (track) {
    track.addEventListener('scroll', function () {
      var first = track.children[0];
      var w = first ? first.offsetWidth + 12 : 322;
      var i = Math.max(0, Math.min(mdots.length - 1, Math.round(track.scrollLeft / w)));
      mdots.forEach(function (d, j) { d.setAttribute('aria-current', String(j === i)); });
    }, { passive: true });
    mdots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        var card = track.children[i];
        if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ── mobile R&D coverflow ── */
  var flow = $('[data-flow]');
  var flowRaf = 0;
  function updateFlow() {
    flowRaf = 0;
    if (!flow || !mqMobile.matches) return;
    var c = flow.scrollLeft + flow.clientWidth / 2;
    $$('.flow-card', flow).forEach(function (card) {
      var mid = card.offsetLeft - flow.offsetLeft + card.offsetWidth / 2;
      var o = Math.max(-1.5, Math.min(1.5, (mid - c) / card.offsetWidth));
      setVar(card, '--o', o.toFixed(3));
      setVar(card, '--a', Math.abs(o).toFixed(3));
    });
  }
  if (flow) {
    flow.addEventListener('scroll', function () { if (!flowRaf) flowRaf = requestAnimationFrame(updateFlow); }, { passive: true });
    window.addEventListener('resize', updateFlow);
    updateFlow();
  }
})();
