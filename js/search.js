/* ==========================================================================
   Поиск по сайту (search.html?q=…).
   Статический сайт: индекс товаров и страниц лежит здесь. Новый товар —
   одна строка в PRODUCTS (те же данные, что в карточке каталога).
   ========================================================================== */
(function () {
  var form = document.querySelector('[data-search-form]');
  if (!form) return;

  /* name, type, weight, price, img (пусто — заглушка), href, keys (вкус/состав для поиска) */
  var PRODUCTS = [
    ['Розовый бархат', 'Пирожное', '40 г', 220, 'img/rozovyj-barhat-600.webp', 'product.html', 'ягодный ягоды малина клубника бархат red velvet'],
    ['Солнечная радость', 'Пирожное', '40 г', 220, 'img/solnechnaya-radost-600.webp', 'product.html', 'цитрус цитрусовый апельсин манго тропический'],
    ['Лавандовая малина', 'Пирожное', '40 г', 220, 'img/lavanda-malina-600.webp', 'product.html', 'ягодный ягоды малина лаванда'],
    ['Иммунная опора', 'Пирожное', '40 г', 220, '', 'product.html', 'полезный иммунитет'],
    ['Черемушкин', 'Пирожное', '40 г', 220, 'img/cheremushkin-600.webp', 'product.html', 'ягодный ягоды черёмуха'],
    ['Шоколадный трепет', 'Пирожное', '40 г', 220, 'img/shokoladnyj-trepet-600.webp', 'product.html', 'шоколад шоколадный какао'],
    ['Кофейная гармония', 'Пирожное', '40 г', 250, '', 'product.html', 'кофе кофейный шоколад'],
    ['Тропическое наслаждение', 'Пирожное', '40 г', 220, 'img/tropicheskoe-naslazhdenie-600.webp', 'product.html', 'цитрус тропический манго маракуйя ананас'],
    ['Адель', 'Конфета', '1 шт', 125, 'assets/img/cat-konfety.png|crop-konfety', 'product.html', 'конфеты трюфель шоколад'],
    ['Набор конфет 12 шт', 'Набор', '12 шт', 1300, 'assets/img/cat-konfety.png|crop-konfety', 'product.html', 'конфеты подарок подарочный шоколад'],
    ['Карамельная нега', 'Корзиночка', '1 шт', 250, 'img/karamelnaya-nega-600.webp', 'product.html', 'карамель орехи'],
    ['Фундук в карамели', 'Корзиночка', '1 шт', 250, 'img/funduk-v-karameli-600.webp', 'product.html', 'карамель орехи орех фундук'],
    ['Зелёный танго', 'Смузи', '225 г', 300, 'assets/img/cat-smuzi.png|crop-smuzi', 'product.html', 'напиток напитки смузи зелёный свежий']
  ];

  /* разделы и информационные страницы */
  var PAGES = [
    ['Пирожные', 'Раздел каталога', 'category.html', 'пирожное десерты'],
    ['Все товары', 'Каталог', 'catalog.html', 'каталог десерты конфеты наборы смузи соки напитки'],
    ['Торт на заказ', 'Заявка на торт к празднику', 'cake.html', 'торт торты праздник день рождения бенто свадьба'],
    ['Доставка и оплата', 'Курьер, сервисы, самовывоз', 'delivery.html', 'доставка оплата курьер самовывоз'],
    ['Как заказать', 'Порядок оформления', 'how-to-order.html', 'заказ оформить'],
    ['Акции', 'Промокоды и предложения', 'promo.html', 'акция скидка промокод'],
    ['Мероприятия', 'События кондитерской', 'events.html', 'мероприятия события новости мастер-класс блог'],
    ['Вопросы и ответы', 'Состав, аллергены, получение', 'faq.html', 'вопросы аллергены состав хранение'],
    ['О нас', 'История кондитерской', 'about.html', 'о компании растительная кондитерская'],
    ['Контакты', 'Телефон, адрес, мессенджеры', 'contacts.html', 'контакты адрес телефон гранд каньон'],
    ['Документы', 'Оферта, политика, реквизиты', 'docs.html', 'документы оферта политика реквизиты']
  ];

  var norm = function (s) { return String(s).toLowerCase().replace(/ё/g, 'е'); };
  /* грубая основа слова: «пирожные» и «пирожное» → «пирож…» */
  var stem = function (w) { return w.length > 5 ? w.slice(0, -2) : w.length > 4 ? w.slice(0, -1) : w; };
  var words = function (q) { return norm(q).split(/[^a-zа-я0-9]+/).filter(Boolean).map(stem); };
  var hit = function (hay, ws) { hay = norm(hay); return ws.every(function (w) { return hay.indexOf(w) !== -1; }); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var rub = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; };
  var plural = function (n, a) { var x = n % 10, y = n % 100; return x === 1 && y !== 11 ? a[0] : x >= 2 && x <= 4 && (y < 10 || y >= 20) ? a[1] : a[2]; };

  var input = form.querySelector('input[name="q"]');
  var status = document.querySelector('[data-search-status]');
  var grid = document.querySelector('[data-search-products]');
  var pagesBox = document.querySelector('[data-search-pages]');
  var pagesList = document.querySelector('[data-search-pages-list]');
  var prodBox = document.querySelector('[data-search-products-box]');
  var empty = document.querySelector('[data-search-empty]');
  var hints = document.querySelector('[data-search-hints]');

  function card(p) {
    var img = p[4].split('|');
    var ph = img[0] ? '<img' + (img[1] ? ' class="' + img[1] + '"' : '') + ' src="' + img[0] + '" alt="" loading="lazy">' : '';
    return '<a class="pcard" href="' + p[5] + '"><div class="pcard__ph">' + ph + '</div>' +
      '<p class="pcard__type">' + esc(p[1]) + '</p><h3 class="pcard__name">' + esc(p[0]) + '</h3>' +
      '<p class="pcard__price">' + p[2] + '  /  ' + rub(p[3]) + '</p></a>';
  }
  function row(p) {
    return '<a class="row-link" href="' + p[2] + '"><span class="row-link__title">' + esc(p[0]) + '</span>' +
      '<span class="row-link__meta">' + esc(p[1]) + '</span><span class="row-link__arr">↗</span></a>';
  }

  function run(q) {
    var ws = words(q);
    var started = ws.length > 0;
    hints.hidden = started;
    if (!started) {
      status.textContent = '';
      prodBox.hidden = pagesBox.hidden = empty.hidden = true;
      return;
    }
    var prods = PRODUCTS.filter(function (p) { return hit(p[0] + ' ' + p[1] + ' ' + p[6], ws); });
    var pages = PAGES.filter(function (p) { return hit(p[0] + ' ' + p[1] + ' ' + p[3], ws); });
    grid.innerHTML = prods.map(card).join('');
    pagesList.innerHTML = pages.map(row).join('');
    prodBox.hidden = !prods.length;
    pagesBox.hidden = !pages.length;
    empty.hidden = prods.length + pages.length > 0;
    var found = [];
    if (prods.length) found.push(prods.length + ' ' + plural(prods.length, ['товар', 'товара', 'товаров']));
    if (pages.length) found.push(pages.length + ' ' + plural(pages.length, ['раздел', 'раздела', 'разделов']));
    status.innerHTML = 'По запросу «' + esc(q.trim()) + '» ' + (found.length ? '— ' + found.join(' и ') : 'ничего не нашлось');
  }

  function sync(q) {
    try { history.replaceState(null, '', q.trim() ? '?q=' + encodeURIComponent(q.trim()) : location.pathname); } catch (e) {}
  }

  var q0 = (new URLSearchParams(location.search).get('q') || '');
  input.value = q0;
  run(q0);

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { run(input.value); sync(input.value); }, 150);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); run(input.value); sync(input.value); input.blur();
  });
  form.querySelector('[data-search-clear]').addEventListener('click', function () {
    input.value = ''; run(''); sync(''); input.focus();
  });
  document.querySelectorAll('[data-q]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); input.value = a.dataset.q; run(input.value); sync(input.value);
    });
  });
  if (!q0) input.focus();
})();
