/* ==========================================================================
   Общие блоки сайта: шапка, раскрытый каталог, подвал, баннер cookie.
   Вставляются в плейсхолдеры <div data-zc="header|menu|footer"></div>,
   чтобы правка шапки/подвала делалась в одном месте для всех страниц.
   Источник: Figma «ЗЦ-сайт» (копия QecoYKq5…, 12.11.2026).
   ========================================================================== */
(function () {
  var A = 'assets/';
  var TEL = 'tel:+79893573333', PHONE = '+7 (989) 357-33-33';
  var TG = 'https://t.me/zelenoetsarstvo', VK = 'https://vk.com/zelenoetsarstvo';
  var POLICY = 'policy.html';
  var COOKIE = 'cookie.html';
  var ext = ' target="_blank" rel="noopener"';
  var phoneIcon = '<img src="' + A + 'icons/phone.svg" alt="" width="20" height="20">';

  var header =
    '<header class="hdr">' +
      /* верхняя строка: desktop — на стекле, tablet/mobile — светлая полоса */
      '<div class="hdr__top">' +
        '<div class="hdr__top-in">' +
          '<p class="hdr__tag only-d">Авторская растительная кондитерская · Санкт-Петербург</p>' +
          '<a class="hdr__t-dlv" href="delivery.html"><span class="only-d">Доставка курьером · Самовывоз  ↗</span><span class="hide-d">Доставка и самовывоз  ↗</span></a>' +
          '<a class="hdr__t-tel hide-m" href="' + TEL + '">' + PHONE + '</a>' +
          '<p class="hdr__t-hours hide-m">10:00–19:00</p>' +
          '<a class="hdr__t-tg hide-m" href="' + TG + '"' + ext + '>Telegram</a>' +
          '<a class="hdr__t-vk hide-m" href="' + VK + '"' + ext + '>VK</a>' +
        '</div>' +
      '</div>' +
      '<div class="hdr__in">' +
        '<a class="hdr__logo" href="index.html" aria-label="Зелёное Царство — на главную">' +
          '<img class="only-d" src="' + A + 'icons/logo.svg" alt="Зелёное Царство" width="189" height="82">' +
          '<img class="hide-d" src="' + A + 'icons/logo-sm.svg" alt="Зелёное Царство" width="126" height="54">' +
        '</a>' +
        '<nav class="hdr__row" aria-label="Основное меню">' +
          '<button class="hdr__catalog w-catalog hide-m" type="button" data-menu-toggle aria-expanded="false" aria-controls="zc-menu">' +
            '<span>Каталог</span><img class="hdr__chev only-d" src="' + A + 'icons/chevron.svg" alt="" width="14" height="9">' +
          '</button>' +
          '<a class="w-delivery hide-m" href="delivery.html"><span class="only-d">Доставка и оплата</span><span class="only-t">Доставка</span></a>' +
          '<a class="w-events only-d" href="events.html">Мероприятия</a>' +
          '<a class="w-contacts hide-m" href="contacts.html">Контакты</a>' +
          '<a class="w-search only-d" href="search.html">Поиск   ↗</a>' +
          /* TODO: избранное */
          '<a class="w-fav" href="#" aria-label="Избранное"><span class="hide-m">♡</span><img class="only-m" src="' + A + 'icons/heart.svg" alt="" width="20" height="20"></a>' +
          '<a class="w-call" href="' + TEL + '" aria-label="Позвонить ' + PHONE + '">' + phoneIcon + '</a>' +
          '<a class="w-search only-t" href="search.html">Поиск</a>' +
          '<a class="w-cart" href="cart.html" data-cart-link><span>Корзина</span><span class="w-cart__n" data-cart-count hidden></span></a>' +
          '<button class="w-burger only-m" type="button" data-menu-toggle aria-expanded="false" aria-controls="zc-menu" aria-label="Открыть меню">☰</button>' +
        '</nav>' +
      '</div>' +
    '</header>';

  function links(list) {
    return list.map(function (l) {
      return '<a href="' + (l[1] || 'catalog.html') + '">' + l[0] + '  ↗</a>';
    }).join('');
  }
  var desserts = [['Пирожные', 'category.html'], ['Конфеты и трюфели'], ['Корзиночки'], ['Бенто и торты'], ['Наборы и подарки'], ['Торт на заказ', 'cake.html']];
  var drinks = [['Смузи'], ['Свежевыжатые соки'], ['Морсы'], ['Кофе и чай']];
  var other = [['Мороженое'], ['Муссы'], ['Хлеб']];

  var menu =
    '<div class="menu" id="zc-menu" role="dialog" aria-label="Каталог">' +
      '<div class="menu__strip"><img src="' + A + 'img/hero-mosaic.png" alt=""></div>' +
      '<div class="menu__in">' +
        '<button class="menu__close" type="button" data-menu-close>Закрыть  ×</button>' +
        '<a class="menu__search" href="search.html">Поиск по товарам  ⌕</a>' +
        '<div class="menu__rule menu__rule--top only-m"></div>' +
        '<div class="menu__head">' +
          '<h2 class="ttl ttl--katalog"><span class="sr-only">Каталог</span>' +
            '<img class="hide-m" src="' + A + 'titles/katalog.svg" alt="">' +
            '<img class="only-m" src="' + A + 'titles/katalog-light.svg" alt="">' +
          '</h2>' +
          '<p class="menu__lead">Выберите категорию или откройте весь каталог.</p>' +
        '</div>' +
        '<div class="menu__rule hide-m"></div>' +
        '<a class="menu__all only-m" href="catalog.html">Все товары  ↗</a>' +
        '<div class="menu__cols">' +
          '<div class="menu__col menu__col--desserts"><h3>ДЕСЕРТЫ</h3>' + links(desserts) + '</div>' +
          '<div class="menu__col menu__col--drinks"><h3>НАПИТКИ</h3>' + links(drinks) +
            '<div class="menu__sub"><h3>ЕЩЁ</h3>' + links(other) + '</div>' +
          '</div>' +
          '<div class="menu__col menu__col--other"><h3>ДРУГОЕ</h3>' + links(other) + '</div>' +
        '</div>' +
        '<a class="menu__all hide-m" href="catalog.html"><span class="only-d">Смотреть все товары  ↗</span><span class="only-t">Все товары  ↗</span></a>' +
        '<div class="menu__foot">' +
          '<a href="delivery.html">Доставка и оплата  ↗</a>' +
          '<div class="menu__contacts">' +
            '<a class="menu__tel" href="' + TEL + '">' + PHONE + '  ↗</a>' +
            '<p class="menu__hours">На связи 10:00–19:00</p>' +
            '<p class="menu__msg"><a href="' + TG + '"' + ext + '>Telegram ↗</a><a href="' + VK + '"' + ext + '>VK ↗</a></p>' +
            '<p class="menu__addr">ТРК «Гранд Каньон»<br>пр. Энгельса, 154 · 1 этаж</p>' +
            '<a class="menu__more" href="contacts.html">Все контакты  ↗</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* Подвал: одна разметка на все ширины, раскладка — в CSS */
  var legal =
    '<div class="ftr__legal">' +
      '<p class="ftr__org"><span>ООО «Зелёное Царство»</span><span class="ftr__sep"> · </span><span>ИНН 7801675671 · ОГРН 1197847240436</span></p>' +
      '<p class="ftr__docs">' +
        '<a href="offer.html">Оферта</a>' +
        '<a href="' + POLICY + '">Политика конфиденциальности</a>' +
        '<a href="' + COOKIE + '">Политика cookie</a>' +
        '<a href="consent.html">Согласие на обработку данных</a>' +
      '</p>' +
      '<p class="ftr__copy">© 2026 Зелёное Царство</p>' +
    '</div>';

  var footer =
    '<footer class="ftr"><div class="ftr__in">' +
      '<div class="ftr__cols">' +
        '<div class="ftr__col"><h3><a href="catalog.html">Каталог</a></h3>' +
          '<ul class="hide-m"><li><a href="category.html">Пирожные</a></li><li><a href="catalog.html">Конфеты и трюфели</a></li>' +
          '<li><a href="catalog.html">Бенто-торты</a></li><li><a href="catalog.html">Наборы и подарки</a></li><li><a href="catalog.html">Смузи и соки</a></li></ul>' +
          '<p class="ftr__line only-m"><a href="category.html">Пирожные</a>  ·  <a href="catalog.html">Конфеты</a>  ·  <a href="catalog.html">Бенто-торты</a>\n' +
          '<a href="catalog.html">Наборы</a>  ·  <a href="catalog.html">Смузи и соки</a></p></div>' +
        '<div class="ftr__col"><h3>Покупателям</h3>' +
          '<ul class="hide-m"><li><a href="delivery.html">Доставка и оплата</a></li><li><a href="how-to-order.html">Как заказать</a></li>' +
          '<li><a href="index.html#reviews">Отзывы</a></li><li><a href="faq.html">Вопросы и ответы</a></li><li><a href="promo.html">Акции</a></li></ul>' +
          '<p class="ftr__line only-m"><a href="delivery.html">Доставка и оплата</a>  ·  <a href="how-to-order.html">Как заказать</a>\n' +
          '<a href="index.html#reviews">Отзывы</a>  ·  <a href="faq.html">Вопросы и ответы</a>  ·  <a href="promo.html">Акции</a></p></div>' +
        '<div class="ftr__col"><h3>О компании</h3>' +
          /* TODO: «Примеры работ» и «Блог» — отдельных страниц нет; пока ведут на торт на заказ и «Мероприятия» */
          '<ul class="hide-m"><li><a href="about.html">О нас</a></li><li><a href="cake.html">Примеры работ</a></li>' +
          '<li><a href="events.html">Мероприятия</a></li><li><a href="events.html">Блог</a></li></ul>' +
          '<p class="ftr__line only-m"><a href="about.html">О нас</a>  ·  <a href="events.html">Мероприятия</a>  ·  <a href="events.html">Блог</a></p></div>' +
        '<div class="ftr__col ftr__col--contacts"><h3><a href="contacts.html">Контакты</a></h3>' +
          '<div class="ftr__reach">' +
            '<a href="' + TEL + '">' + PHONE + '</a>' +
            '<a href="mailto:zelenoetsarstvo@ya.ru">zelenoetsarstvo@ya.ru</a>' +
            '<p class="ftr__msg"><a href="' + TG + '"' + ext + '>Telegram ↗</a><a href="' + VK + '"' + ext + '>VK ↗</a></p>' +
            '<p class="ftr__addr">ТРК «Гранд Каньон»<span class="ftr__br"> · </span>пр. Энгельса, 154 · 1 этаж</p>' +
            '<a class="ftr__more" href="contacts.html">Все контакты  ↗</a>' +
          '</div></div>' +
      '</div>' +
      legal +
    '</div></footer>';

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

  function put(name, html) {
    var el = document.querySelector('[data-zc="' + name + '"]');
    if (el) el.outerHTML = html;
  }
  put('header', header);
  put('menu', menu);
  put('footer', footer);

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
