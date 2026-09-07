/* OMRC — dropdown navigation */
(function () {
  var menus = document.querySelectorAll('.nav-links li.has-menu');

  function closeAll(except) {
    menus.forEach(function (m) {
      if (m !== except) {
        m.classList.remove('is-open');
        var b = m.querySelector('.nav-top');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }

  menus.forEach(function (item) {
    var button = item.querySelector('.nav-top');
    if (!button) return;
    button.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(item);
    });
  });

  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
