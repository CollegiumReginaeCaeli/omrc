/* OMRC — announcements
   ---------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO POST AN ANNOUNCEMENT.

   Add a new entry to the top of the list below. It appears automatically in
   both places: the banner on the home page (newest only) and the full list on
   announcements.html.

     date   required, as YYYY-MM-DD
     title  required, kept short — the banner shows it on one line
     body   required, a sentence or two
     link   optional, a page on this site for "read more"

   Entries are sorted by date, so the order you type them in does not matter.
   Deleting every entry is safe: the banner disappears and the announcements
   page says there is nothing at present.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var ANNOUNCEMENTS = [
    {
      date: '2026-09-24',
      title: 'Blessed Fulton J. Sheen',
      body: 'The Co-Patron of the Order was beatified on 24 September 2026 at ' +
            'the Dome at America’s Center in St. Louis, Missouri, by Cardinal ' +
            'Luis Antonio Tagle as legate of Pope Leo XIV. His feast is kept on ' +
            '9 December. Blessed Fulton J. Sheen, pray for us.',
      link: 'co-patron.html'
    },
    {
      date: '2026-09-14',
      title: 'The Collegium Shop Opens Soon',
      body: 'The Collegium Reginae Caeli is preparing its online shop, where ' +
            'prayer cards, the Roman Antiphonale, and Missals and Breviaries ' +
            'for the ancient rites will be offered.',
      link: 'shop.html'
    }
  ];

  // ---------------------------------------------------------------- helpers

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

  /* Build the date from its parts. new Date('2026-09-14') is parsed as UTC
     midnight, which in the Americas prints as the previous day. */
  function formatDate(iso) {
    var p = String(iso).split('-').map(Number);
    if (p.length !== 3 || p.some(isNaN)) return '';
    return p[2] + ' ' + MONTHS[p[1] - 1] + ' ' + p[0];
  }

  function sorted() {
    return ANNOUNCEMENTS
      .filter(function (a) { return a && a.date && a.title; })
      .slice()
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;          // never innerHTML: entries are plain text
    return node;
  }

  // ------------------------------------------------------------ home banner

  function dismissKey(item) {
    return 'omrc-announcement:' + item.date + ':' + item.title;
  }

  function wasDismissed(item) {
    try { return window.localStorage.getItem(dismissKey(item)) === '1'; }
    catch (e) { return false; }                 // private mode, blocked storage
  }

  function remember(item) {
    try { window.localStorage.setItem(dismissKey(item), '1'); } catch (e) {}
  }

  function renderBanner(host) {
    var list = sorted();
    if (!list.length) return;

    var item = list[0];
    if (wasDismissed(item)) return;             // a newer entry gets a new key

    var inner = el('div', 'announcement-inner');
    inner.appendChild(el('span', 'announcement-label', 'Announcement'));

    var text = el('p', 'announcement-text');
    text.appendChild(el('strong', null, item.title));
    if (item.body) text.appendChild(document.createTextNode(' — ' + item.body));
    inner.appendChild(text);

    var more = el('a', 'announcement-more', 'Read more');
    more.href = item.link || 'announcements.html';
    inner.appendChild(more);

    var close = el('button', 'announcement-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss announcement');
    close.addEventListener('click', function () {
      remember(item);
      host.hidden = true;
    });
    inner.appendChild(close);

    host.appendChild(inner);
    host.hidden = false;
  }

  // ------------------------------------------------------ announcements page

  function renderList(host) {
    var list = sorted();

    if (!list.length) {
      host.appendChild(el('p', 'note', 'There are no announcements at present.'));
      return;
    }

    list.forEach(function (item) {
      var article = el('article', 'announcement-card');

      var time = el('time', 'announcement-date', formatDate(item.date));
      time.setAttribute('datetime', item.date);
      article.appendChild(time);

      article.appendChild(el('h3', null, item.title));
      if (item.body) article.appendChild(el('p', null, item.body));

      if (item.link) {
        var a = el('a', 'announcement-more', 'Read more');
        a.href = item.link;
        article.appendChild(a);
      }
      host.appendChild(article);
    });
  }

  var banner = document.getElementById('announcement-banner');
  if (banner) renderBanner(banner);

  var listHost = document.getElementById('announcement-list');
  if (listHost) renderList(listHost);
})();
