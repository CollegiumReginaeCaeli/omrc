/* OMRC — site navigation
   Two behaviours share this bar. Above the breakpoint the links sit in one
   row and each "has-menu" item discloses its own submenu. Below it the whole
   list collapses behind a menu button, since seven links wrap to four rows
   and the bar is sticky. CSS already opens submenus on :hover and
   :focus-within, so this script handles the click/tap and keyboard paths. */
(function () {
  'use strict';

  var inner = document.querySelector('.nav-inner');
  var toggle = inner && inner.querySelector('.nav-toggle');
  var items = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links li.has-menu')
  );

  function close(item) {
    item.classList.remove('is-open');
    var button = item.querySelector('.nav-top');
    if (button) button.setAttribute('aria-expanded', 'false');
  }

  function closeAll(except) {
    items.forEach(function (item) {
      if (item !== except) close(item);
    });
  }

  function menuIsOpen() {
    return Boolean(inner) && inner.classList.contains('is-open');
  }

  function closeMenu() {
    if (!menuIsOpen()) return;
    inner.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    closeAll(null);
  }

  if (toggle) {
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = inner.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!isOpen) closeAll(null);
    });
  }

  items.forEach(function (item) {
    var button = item.querySelector('.nav-top');
    if (!button) return;

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeAll(item);
      var isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', function (event) {
    closeAll(null);
    /* A tap inside the bar is navigation or a submenu toggle; only a tap
       outside it should dismiss the collapsed menu as a whole. */
    if (inner && !inner.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    /* Return focus to the control being dismissed, innermost first, so a
       keyboard user is not dropped back at the top of the document. */
    var open = document.querySelector('.nav-links li.has-menu.is-open');
    var button = open && open.querySelector('.nav-top');
    if (button) {
      closeAll(null);
      button.focus();
      return;
    }
    if (menuIsOpen()) {
      closeMenu();
      toggle.focus();
    }
  });
})();
