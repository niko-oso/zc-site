/* ==========================================================================
   ИСТОЧНИК шапки, раскрытого каталога и подвала (Figma «ЗЦ-сайт», копия QecoYKq5…).
   На страницах эти блоки лежат статичной разметкой между <!-- zc:… --> и <!-- /zc:… -->
   (так их видят поисковики без JS). Правка: изменить здесь и пересобрать:
     powershell -ExecutionPolicy Bypass -File tools\build-layout.ps1
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
          '<a class="hdr__t-cake hide-d" href="cake.html">Заказать торт  ↗</a>' +
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
          '<a class="w-fav" href="favorites.html" data-fav-link aria-label="Избранное"><span class="w-fav__ico" aria-hidden="true"></span><span class="w-fav__n" data-fav-count hidden></span></a>' +
          '<a class="w-call" href="' + TEL + '" aria-label="Позвонить ' + PHONE + '">' + phoneIcon + '</a>' +
          '<a class="w-search only-t" href="search.html">Поиск</a>' +
          '<a class="w-cart" href="cart.html" data-cart-link><span>Корзина</span><span class="w-cart__n" data-cart-count hidden></span></a>' +
          '<a class="w-cake btn btn--primary only-d" href="cake.html">Заказать торт</a>' +
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
      '<div class="menu__strip"><img src="' + A + 'img/hero-mosaic.webp" alt="Фирменная мозаика «Зелёного Царства»" loading="lazy" decoding="async"></div>' +
      '<div class="menu__in">' +
        '<button class="menu__close" type="button" data-menu-close>Закрыть  ×</button>' +
        '<a class="menu__search" href="search.html">Поиск по товарам  ⌕</a>' +
        '<div class="menu__rule menu__rule--top only-m"></div>' +
        '<div class="menu__head">' +
          '<h2 class="ttl ttl--katalog"><span class="sr-only">Каталог</span>' +
            '<img class="hide-m" src="' + A + 'titles/katalog.svg" alt="Каталог" aria-hidden="true">' +
            '<img class="only-m" src="' + A + 'titles/katalog-light.svg" alt="Каталог" aria-hidden="true">' +
          '</h2>' +
          '<p class="menu__lead">Выберите категорию или откройте весь каталог.</p>' +
        '</div>' +
        '<div class="menu__rule hide-m"></div>' +
        '<a class="menu__all only-m" href="catalog.html">Все десерты  ↗</a>' +
        '<div class="menu__cols">' +
          '<div class="menu__col menu__col--desserts"><h3>ДЕСЕРТЫ</h3>' + links(desserts) + '</div>' +
          '<div class="menu__col menu__col--drinks"><h3>НАПИТКИ</h3>' + links(drinks) +
            '<div class="menu__sub"><h3>ЕЩЁ</h3>' + links(other) + '</div>' +
          '</div>' +
          '<div class="menu__col menu__col--other"><h3>ДРУГОЕ</h3>' + links(other) + '</div>' +
        '</div>' +
        '<a class="menu__all hide-m" href="catalog.html"><span class="only-d">Смотреть все десерты  ↗</span><span class="only-t">Все десерты  ↗</span></a>' +
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
        '<div class="ftr__col"><h3><a href="catalog.html">Десерты</a></h3>' +
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
          /* «Примеры работ» удалены (попали в макет по ошибке, 13.11).
             «Блог» скрыт до появления страницы — вернуть пунктом: <li><a href="blog.html">Блог</a></li> и «  ·  <a href="blog.html">Блог</a>» в мобильной строке. */
          '<ul class="hide-m"><li><a href="about.html">О нас</a></li><li><a href="events.html">Мероприятия</a></li></ul>' +
          '<p class="ftr__line only-m"><a href="about.html">О нас</a>  ·  <a href="events.html">Мероприятия</a></p></div>' +
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

  window.ZC_PARTIALS = { header: header, menu: menu, footer: footer };
})();
