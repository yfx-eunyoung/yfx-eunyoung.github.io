/* yfxlabs.dev — detail pages: copy buttons on code blocks */
(function () {
  'use strict';
  document.querySelectorAll('[data-post-copy]').forEach(function (btn) {
    var t;
    btn.addEventListener('click', function () {
      var pre = btn.closest('.post-code').querySelector('pre');
      var text = (pre ? pre.innerText : '').replace(/\n+$/, '');
      var done = function () {
        btn.textContent = 'Copied';
        clearTimeout(t);
        t = setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else done();
    });
  });
})();
