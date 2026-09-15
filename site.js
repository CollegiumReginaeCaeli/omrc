/* OMRC — dropdown navigation
   A disclosure pattern: each button toggles the visibility of its own
   submenu. CSS already opens menus on :hover and :focus-within, so this
   script only handles the click/tap and keyboard paths. */
(function () {
  'use strict';

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

  document.addEventListener('click', function () {
    closeAll(null);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    /* Return focus to the trigger of whichever menu we are dismissing;
       otherwise a keyboard user is dropped back at the top of the page. */
    var open = document.querySelector('.nav-links li.has-menu.is-open');
    var button = open && open.querySelector('.nav-top');
    closeAll(null);
    if (button) button.focus();
  });
})();
