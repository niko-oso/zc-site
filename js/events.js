/* ==========================================================================
   Мероприятия и новости: один список → карточки на events.html и страница event.html?id=…
   Новый материал = одна запись в ITEMS (первыми — мероприятия, затем новости),
   затем пересобрать статичные страницы: tools/build-events.html (см. DESIGN-SYSTEM.md).
   Поля:
     id      — латиница, адрес страницы: event.html?id=<id>
     kind    — 'event' (мероприятие: дата/время/место/запись) или 'news'
     tag     — подпись над заголовком (КАПС), title, lead — для карточки и шапки страницы
     img     — фото для карточки (…-600.webp), cover — крупное фото для страницы
     date, time, place, price — только для мероприятий (показываются в блоке «Коротко»)
     body    — текст страницы (HTML: <p>, <h2>, <ul><li>)
     cta     — главная ссылка: { text, href }; more — доп. ссылки в блоке «Коротко»
   Тексты — по данным сайта; реальные мероприятия от заказчика пока не пришли (см. пример).
   ========================================================================== */
(function () {
  var TEL = 'tel:+79893573333', TG = 'https://t.me/zelenoetsarstvo';

  var ITEMS = [
    {
      /* TODO: пример анонса — заменить реальным мероприятием от заказчика или удалить */
      id: 'primer-meropriyatiya', kind: 'event', example: true,
      tag: 'МЕРОПРИЯТИЕ  ·  ПРИМЕР', title: 'Так будет выглядеть анонс мероприятия',
      lead: 'Шаблон для дегустаций, мастер-классов и встреч: дата, время, место и запись — в блоке «Коротко».',
      img: 'img/eskimo-2-600.webp', cover: 'img/eskimo-2.webp',
      date: 'Дата уточняется', time: 'Время уточняется', place: 'ТРК «Гранд Каньон», пр. Энгельса, 154 · 1 этаж', price: 'Условия участия уточняются',
      body:
        '<p>Это пример страницы мероприятия. Когда заказчик пришлёт реальное событие, здесь будет его описание: что произойдёт, для кого оно и что взять с собой.</p>' +
        '<h2>Как будет устроено</h2>' +
        '<ul><li>Дата, время и место — в блоке «Коротко» справа (на телефоне — под заголовком).</li><li>Кнопка «Записаться» ведёт к звонку или в Telegram.</li><li>Программу можно расписать списком, как этот.</li></ul>' +
        '<p>Мероприятия стоят в списке первыми, новости идут следом — без вкладок.</p>',
      cta: { text: 'Записаться по телефону', href: TEL },
      more: [{ text: 'Написать в Telegram  ↗', href: TG, ext: true }]
    },
    {
      id: 'bento-k-prazdniku', kind: 'news',
      tag: 'НОВОСТИ  ·  НА ЗАКАЗ', title: 'Бенто-торты к празднику',
      lead: 'Принимаем заявки на бенто «Тропическое наслаждение» 500 г. Оформление и надпись обсуждаем с менеджером.',
      img: 'img/tropicheskoe-naslazhdenie-600.webp', cover: 'img/tropicheskoe-naslazhdenie.webp',
      body:
        '<p>Небольшой торт для дня рождения, встречи или подарка — бенто «Тропическое наслаждение» весом 500 г. Стоимость — 2 500 ₽.</p>' +
        '<h2>Как заказать</h2>' +
        '<ul><li>Оставьте заявку на странице «Торт на заказ»: дата, вес, начинка и пожелания к оформлению.</li><li>Надпись на торте — до 30 символов, возможность подтвердит менеджер.</li><li>Дату праздника можно выбрать не раньше чем через три дня.</li></ul>' +
        '<h2>Что дальше</h2>' +
        '<p>Менеджер свяжется с вами с 10:00 до 19:00, подтвердит возможность, срок, предоплату и итоговую стоимость — до оплаты. Забрать торт можно самовывозом или с доставкой по вторникам и пятницам.</p>',
      cta: { text: 'Оставить заявку', href: 'cake.html' },
      more: [{ text: 'Условия доставки  ↗', href: 'delivery.html' }]
    },
    {
      id: 'samovyvoz', kind: 'news',
      tag: 'НОВОСТИ  ·  САМОВЫВОЗ', title: 'Самовывоз в ТРК «Гранд Каньон»',
      lead: 'Заказ можно забрать в ТРК «Гранд Каньон» на проспекте Энгельса. Перед поездкой согласуйте готовность.',
      img: 'img/solnechnaya-radost-600.webp', cover: 'img/solnechnaya-radost.webp',
      body:
        '<p>Самовывоз — бесплатно: ТРК «Гранд Каньон», пр. Энгельса, 154, 1 этаж, зона спортивных магазинов.</p>' +
        '<h2>Как забрать заказ</h2>' +
        '<ul><li>Соберите заказ в корзине и выберите «Самовывоз» и удобный день.</li><li>Менеджер подтвердит наличие и время выдачи — с 10:00 до 19:00.</li><li>Перед поездкой дождитесь подтверждения, что заказ готов.</li></ul>' +
        '<p>Оплата — по ссылке после подтверждения или при получении.</p>',
      cta: { text: 'Оформить заказ', href: 'cart.html' },
      more: [{ text: 'Адрес на карте и контакты  ↗', href: 'contacts.html' }]
    },
    {
      id: 'razmer-porcii', kind: 'news',
      tag: 'ВЫБОР ДЕСЕРТА', title: 'Как выбрать размер порции',
      lead: 'Сравниваем доступные веса и цены в карточке товара — на примере пирожных.',
      img: 'img/limon-600.webp', cover: 'img/limon.webp',
      body:
        '<p>У многих десертов несколько форматов. Выбрать удобно прямо в карточке товара: цена меняется сразу при выборе формата.</p>' +
        '<h2>На примере «Розового бархата»</h2>' +
        '<ul><li>40 г — 220 ₽: порция к кофе, чтобы попробовать новый вкус.</li><li>80 г — 390 ₽: полноценный десерт или на двоих.</li></ul>' +
        '<p>Если сомневаетесь, сколько взять на компанию, — спросите менеджера по телефону или в Telegram.</p>',
      cta: { text: 'Открыть карточку товара', href: 'product.html' },
      more: [{ text: 'Все пирожные  ↗', href: 'category.html' }]
    },
    {
      id: 'chto-podarit', kind: 'news',
      tag: 'ПОДАРКИ', title: 'Что подарить любителю сладкого',
      lead: 'Набор конфет или бенто-торт: что выбрать и когда оформить заказ.',
      img: 'assets/img/news-podarok.webp', cover: 'assets/img/news-podarok.webp',
      body:
        '<p>Два варианта, которые удобно дарить.</p>' +
        '<h2>Набор конфет</h2>' +
        '<p>12 конфет — 1 300 ₽. Подходит как самостоятельный подарок или дополнение к букету.</p>' +
        '<h2>Бенто-торт</h2>' +
        '<p>«Тропическое наслаждение», 500 г — 2 500 ₽. С надписью до 30 символов. Заявку стоит оставить заранее: дату праздника можно выбрать не раньше чем через три дня.</p>',
      cta: { text: 'Смотреть каталог', href: 'catalog.html' },
      more: [{ text: 'Торт на заказ  ↗', href: 'cake.html' }]
    },
    {
      id: 'sostav-i-allergeny', kind: 'news',
      tag: 'ВЫБОР ДЕСЕРТА', title: 'Где смотреть состав и аллергены',
      lead: 'Состав, пищевая ценность и хранение — в карточке каждого десерта. При аллергии уточните детали у менеджера.',
      img: 'img/rozovyj-barhat-2-600.webp', cover: 'img/rozovyj-barhat-2.webp',
      body:
        '<p>В карточке каждого десерта есть три блока: «Состав и аллергены», «Пищевая ценность» и «Срок и условия хранения».</p>' +
        '<h2>Что там указано</h2>' +
        '<ul><li>Полный состав — аллергены выделены.</li><li>Калорийность, белки, жиры и углеводы — на 100 г и на порцию.</li><li>Срок годности и температура хранения.</li></ul>' +
        '<p>Например, в «Розовом бархате» аллергены — кешью и миндаль. При аллергии напишите или позвоните менеджеру до заказа и уточните возможные следы ингредиентов.</p>',
      cta: { text: 'Пример карточки', href: 'product.html' },
      more: [{ text: 'Вопросы и ответы  ↗', href: 'faq.html' }]
    },
    {
      id: 'dostavka-vt-pt', kind: 'news',
      tag: 'НОВОСТИ  ·  ДОСТАВКА', title: 'Доставка по вторникам и пятницам',
      lead: 'Бесплатно при заказе от 2 000 ₽. Для небольших заказов стоимость доставки рассчитает менеджер.',
      img: 'assets/img/cat-smuzi.webp', cover: 'assets/img/cat-smuzi.webp', coverPos: 'center 30%',
      body:
        '<p>Свой курьер возит заказы по вторникам и пятницам.</p>' +
        '<ul><li>От 2 000 ₽ — доставка бесплатно.</li><li>До 2 000 ₽ — стоимость рассчитает менеджер при подтверждении.</li><li>Интервал доставки согласует менеджер.</li></ul>' +
        '<h2>Как заказать</h2>' +
        '<p>Соберите заказ в корзине, выберите «Курьер», день доставки и укажите адрес. Нужно сегодня — закажите в Яндекс Еде.</p>',
      cta: { text: 'Оформить в корзине', href: 'cart.html' },
      more: [{ text: 'Доставка и оплата  ↗', href: 'delivery.html' }, { text: 'Яндекс Еда  ↗', href: 'https://eda.yandex.ru/r/zelenoe_carstvo', ext: true }]
    }
  ];

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* У каждого материала — своя статичная страница event-<id>.html (собирает tools/build-events.html):
     уникальные title, description и H1 есть в HTML без JS. */
  var url = function (it) { return 'event-' + it.id + '.html'; };
  var ITEMS_SORTED = ITEMS.filter(function (i) { return i.kind === 'event'; }).concat(ITEMS.filter(function (i) { return i.kind !== 'event'; }));

  var card = function (it) {
    return '<article class="ncard">' +
      '<a class="ncard__ph" href="' + url(it) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(it.img) + '" alt="' + esc(it.title) + '" loading="lazy"></a>' +
      '<p class="ncard__tag">' + esc(it.tag) + '</p>' +
      '<h2 class="ncard__title"><a href="' + url(it) + '">' + esc(it.title) + '</a></h2>' +
      '<p class="ncard__lead">' + esc(it.lead) + '</p>' +
      '<a class="link-arrow" href="' + url(it) + '">' + (it.kind === 'event' ? 'Подробнее о мероприятии' : 'Читать') + '  ↗</a>' +
    '</article>';
  };

  /* Содержимое <main> страницы материала */
  var pageMain = function (it) {
    var facts = [['Дата', it.date], ['Время', it.time], ['Место', it.place], ['Участие', it.price]].filter(function (f) { return f[1]; });
    var cls = 'ev wrap' + (it.kind === 'event' ? ' is-event' : '') + (it.example ? ' is-example' : '');
    var related = ITEMS_SORTED.filter(function (i) { return i.id !== it.id; }).slice(0, 3).map(card).join('\n          ');
    return '' +
'  <main class="' + cls + '">\n' +
'    <nav class="crumbs lg__crumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a>  /  <a href="events.html">Мероприятия</a>  /  <span aria-current="page">' + esc(it.title) + '</span></nav>\n\n' +
'    <header class="ev__head">\n' +
'      <p class="ev__tag">' + esc(it.tag) + '</p>\n' +
'      <h1 class="display display--m ev__title">' + esc(it.title) + '</h1>\n' +
'      <p class="ev__lead">' + esc(it.lead) + '</p>\n' +
'    </header>\n\n' +
'    <figure class="ev__cover"><img src="' + esc(it.cover || it.img) + '" alt="' + esc(it.title) + '"' + (it.coverPos ? ' style="object-position: ' + esc(it.coverPos) + '"' : '') + '></figure>\n\n' +
'    <div class="ev__layout">\n' +
'      <article class="lg__text ev__body">\n        ' + it.body.replace(/(<\/p>|<\/h2>|<\/ul>)(?=<)/g, '$1\n        ') + '\n      </article>\n\n' +
'      <aside class="ev__aside" aria-label="' + (it.kind === 'event' ? 'Коротко' : 'По теме') + '">\n' +
'        <div class="ev__card">\n' +
'          <p class="ev__card-label">' + (it.kind === 'event' ? 'КОРОТКО' : 'ПО ТЕМЕ') + '</p>\n' +
(facts.length ? '          <dl class="ev__facts">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>\n' : '') +
'          <a class="btn btn--primary ev__cta" href="' + esc(it.cta.href) + '">' + esc(it.cta.text) + '</a>\n' +
((it.more || []).length ? '          <div class="ev__more">' + it.more.map(function (m) {
      return '<a class="link-arrow" href="' + esc(m.href) + '"' + (m.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(m.text) + '</a>';
    }).join('') + '</div>\n' : '') +
'        </div>\n' +
'        <a class="ev__back" href="events.html">← Все мероприятия</a>\n' +
'      </aside>\n' +
'    </div>\n\n' +
'    <section class="ev__related" aria-labelledby="ev-rel">\n' +
'      <h2 class="ev__related-title" id="ev-rel">Ещё материалы</h2>\n' +
'      <div class="ngrid">\n          ' + related + '\n      </div>\n' +
'    </section>\n' +
'  </main>\n';
  };

  /* Для генератора статичных страниц */
  window.ZC_EVENTS = { items: ITEMS_SORTED, card: card, main: pageMain, url: url };

  /* ---------- Список (events.html): статичные карточки уже в HTML; если пусто — рисуем ---------- */
  var list = document.querySelector('[data-events-list]');
  if (list && !list.children.length) list.innerHTML = ITEMS_SORTED.map(card).join('');

  /* ---------- Старые ссылки event.html?id=… → event-<id>.html ---------- */
  var page = document.querySelector('[data-event]');
  if (!page) return;
  var id = new URLSearchParams(location.search).get('id');
  var it = ITEMS.filter(function (i) { return i.id === id; })[0];
  if (it) { location.replace(url(it)); return; }
  page.classList.add('is-missing');
})();
