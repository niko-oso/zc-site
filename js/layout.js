/* ==========================================================================
   Общие блоки сайта: шапка, раскрытый каталог, подвал, баннер cookie.
   Шапка, каталог и подвал — статичная разметка в каждом HTML (источник: tools/partials.js,
   сборка: tools/build-layout.ps1). Здесь — поведение: корзина, избранное, отправка форм, cookie, меню.
   Источник: Figma «ЗЦ-сайт» (копия QecoYKq5…, 12.11.2026).
   ========================================================================== */
(function () {
  var COOKIE = 'cookie.html';

  /* Баннер cookie (Cookie / Web · Tablet · Mobile) */
  var cookieBar =
    '<div class="cookie" role="dialog" aria-label="Настройки cookie">' +
      '<div class="cookie__text">' +
        '<p class="cookie__title">Настройки cookie</p>' +
        '<p class="cookie__desc">Сайт использует cookie. Можно принять все или оставить только необходимые.</p>' +
        '<a class="cookie__link" href="' + COOKIE + '">Политика cookie  ↗</a>' +
      '</div>' +
      '<div class="cookie__btns">' +
        '<button class="cookie__btn cookie__btn--line" type="button" data-cookie="necessary">Только необходимые</button>' +
        '<button class="cookie__btn" type="button" data-cookie="all">Принять все</button>' +
      '</div>' +
    '</div>';


  /* ---------- Корзина: хранится в браузере (localStorage «zc-cart»), общая для всех страниц ----------
     Позиция: { id, name, type, fmt, price, img, href, qty }. Счётчик в шапке = сумма qty. */
  var CART = 'zc-cart';
  function cartGet() {
    try { var a = JSON.parse(localStorage.getItem(CART) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function cartCount() { return cartGet().reduce(function (n, i) { return n + (+i.qty || 0); }, 0); }
  function plural(n, a) { var x = n % 10, y = n % 100; return x === 1 && y !== 11 ? a[0] : x >= 2 && x <= 4 && (y < 10 || y >= 20) ? a[1] : a[2]; }
  function paintCart(bump) {
    var n = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(function (b) {
      b.textContent = n > 99 ? '99+' : n;
      b.hidden = !n;
      if (bump && n) { b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump'); }
    });
    document.querySelectorAll('[data-cart-link]').forEach(function (a) {
      a.setAttribute('aria-label', n ? 'Корзина, ' + n + ' ' + plural(n, ['товар', 'товара', 'товаров']) : 'Корзина, пусто');
    });
  }
  function cartSet(list, bump) {
    try { localStorage.setItem(CART, JSON.stringify(list)); } catch (e) {}
    paintCart(bump);
    document.dispatchEvent(new CustomEvent('zc-cart'));
  }
  window.ZC = window.ZC || {};
  window.ZC.cart = {
    get: cartGet,
    set: cartSet,
    count: cartCount,
    plural: plural,
    add: function (item) {
      var list = cartGet(), cur = list.filter(function (i) { return i.id === item.id; })[0];
      if (cur) cur.qty = Math.min(99, (+cur.qty || 0) + 1);
      else { item.qty = 1; list.push(item); }
      cartSet(list, true);
      return cur ? cur.qty : 1;
    }
  };
  paintCart(false);
  /* изменения из другой вкладки */
  window.addEventListener('storage', function (e) { if (e.key === CART) { paintCart(false); document.dispatchEvent(new CustomEvent('zc-cart')); } });

  /* ---------- Избранное: localStorage «zc-fav», общий счётчик у ♡ в шапке ----------
     Позиция: { id (= название товара), name, type, fmt, price, img, href }. */
  var FAV = 'zc-fav';
  function favGet() {
    try { var a = JSON.parse(localStorage.getItem(FAV) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function paintFav(bump) {
    var n = favGet().length;
    document.querySelectorAll('[data-fav-count]').forEach(function (b) {
      b.textContent = n > 99 ? '99+' : n;
      b.hidden = !n;
    });
    document.querySelectorAll('[data-fav-link]').forEach(function (a) {
      if (bump && n) { a.classList.remove('is-bump'); void a.offsetWidth; a.classList.add('is-bump'); }
      a.setAttribute('aria-label', n ? 'Избранное, ' + n + ' ' + plural(n, ['товар', 'товара', 'товаров']) : 'Избранное, пусто');
    });
  }
  function favSet(list, bump) {
    try { localStorage.setItem(FAV, JSON.stringify(list)); } catch (e) {}
    paintFav(bump);
    document.dispatchEvent(new CustomEvent('zc-fav'));
  }
  window.ZC.fav = {
    get: favGet,
    set: favSet,
    has: function (id) { return favGet().some(function (i) { return i.id === id; }); },
    /* добавить или убрать; возвращает true, если товар теперь в избранном */
    toggle: function (item) {
      var list = favGet(), on = list.some(function (i) { return i.id === item.id; });
      favSet(on ? list.filter(function (i) { return i.id !== item.id; }) : list.concat([item]), !on);
      return !on;
    }
  };
  paintFav(false);
  window.addEventListener('storage', function (e) { if (e.key === FAV) { paintFav(false); document.dispatchEvent(new CustomEvent('zc-fav')); } });

  /* ---------- Отправка заявок: ZC.send(вид, {поле: значение}) → Promise ----------
     Все формы сайта (заказ из корзины, торт на заказ) отправляют данные только через эту функцию.
     • Локально (формы Тильды нет) — имитация: данные пишутся в консоль, промис выполняется.
     • На Тильде: на странице стоит скрытая форма Тильды с приёмщиком «почта» (и/или Telegram/CRM).
       В TILDA_FORMS указать селектор её блока (#rec…). Скрипт заполнит поля по name
       (недостающие создаст скрытыми), нажмёт отправку и дождётся ответа Тильды. */
  var TILDA_FORMS = { order: '', cake: '' }; /* TODO при переносе: например { order: '#rec812345678', cake: '#rec812345679' } */
  window.ZC.send = function (kind, data) {
    return new Promise(function (resolve, reject) {
      var sel = TILDA_FORMS[kind], box = sel ? document.querySelector(sel) : null, form = box ? box.querySelector('form') : null;
      if (!form) {
        try { console.info('[ZC.send] ' + kind + ' (локально, без отправки)', data); } catch (e) {}
        setTimeout(resolve, 700);
        return;
      }
      Object.keys(data).forEach(function (k) {
        var inp = form.querySelector('[name="' + k + '"]');
        if (!inp) { inp = document.createElement('input'); inp.type = 'hidden'; inp.name = k; form.appendChild(inp); }
        inp.value = data[k];
      });
      var settled = false;
      function finish(ok) { if (settled) return; settled = true; ok ? resolve() : reject(new Error('send')); }
      form.addEventListener('tildaform:aftersuccess', function () { finish(true); });
      form.addEventListener('tildaform:aftererror', function () { finish(false); });
      var btn = form.querySelector('[type="submit"], .t-submit');
      if (btn) btn.click(); else if (form.requestSubmit) form.requestSubmit(); else form.submit();
      /* запасной вариант: Тильда показала своё «успешно» */
      setTimeout(function () {
        var ok = form.querySelector('.js-successbox');
        finish(!!ok && getComputedStyle(ok).display !== 'none');
      }, 10000);
    });
  };

  /* ---------- Cookie: показываем, пока посетитель не выбрал ---------- */
  var KEY = 'zc-cookie', choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (!choice) {
    document.body.insertAdjacentHTML('beforeend', cookieBar);
    var bar = document.querySelector('.cookie');
    document.body.classList.add('has-cookie');
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      try { localStorage.setItem(KEY, b.dataset.cookie); } catch (err) {}
      bar.remove();
      document.body.classList.remove('has-cookie');
    });
  }

  /* ---------- Открытие/закрытие каталога ---------- */
  var body = document.body;
  function setOpen(open) {
    body.classList.toggle('menu-open', open);
    document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (open) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-menu-toggle]');
    if (t) { e.preventDefault(); setOpen(!body.classList.contains('menu-open')); return; }
    if (e.target.closest('[data-menu-close]')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) setOpen(false);
  });
  if (location.hash === '#menu') setOpen(true);

  /* ---------- Закреплённая шапка: после прокрутки за пределы шапки — компактная, сверху ---------- */
  var hdrEl = document.querySelector('.hdr');
  function stick() {
    if (!hdrEl) return;
    var on = window.scrollY > hdrEl.offsetHeight + 40 && !body.classList.contains('menu-open');
    body.classList.toggle('hdr-stuck', on);
  }
  window.addEventListener('scroll', stick, { passive: true });
  stick();

  /* ---------- Кнопка «Наверх»: появляется после первого экрана ---------- */
  document.body.insertAdjacentHTML('beforeend', '<button class="to-top" type="button" aria-label="Наверх"></button>');
  var up = document.querySelector('.to-top');
  function toggleUp() { up.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.8); }
  window.addEventListener('scroll', toggleUp, { passive: true });
  toggleUp();
  up.addEventListener('click', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
