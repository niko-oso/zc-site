/* ==========================================================================
   Интерактив страниц: формат товара, галерея, количество в корзине.
   ========================================================================== */
(function () {
  var rub = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; };

  /* ---------- Карточка: выбор формата меняет цену ---------- */
  var priceOut = document.querySelector('[data-price-out]');
  document.querySelectorAll('.prod__formats input[type="radio"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (r.checked && priceOut) priceOut.textContent = rub(r.dataset.price);
    });
  });

  /* ---------- Карточка: миниатюры галереи ---------- */
  var main = document.querySelector('[data-gallery-main]');
  document.querySelectorAll('.prod__thumb').forEach(function (t) {
    t.addEventListener('click', function () {
      if (main) main.src = t.dataset.src;
      document.querySelectorAll('.prod__thumb').forEach(function (x) { x.removeAttribute('aria-current'); });
      t.setAttribute('aria-current', 'true');
    });
  });

  /* ---------- Карточка товара: «Добавить к выбору» кладёт товар в корзину ---------- */
  document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
    var label = btn.textContent, added = document.querySelector('[data-added]'), timer;
    btn.addEventListener('click', function (e) {
      if (!window.ZC || !ZC.cart) return; /* без хранилища — обычный переход в корзину */
      e.preventDefault();
      var f = document.querySelector('.prod__formats input:checked');
      var fmt = f ? f.value : '', price = f ? +f.dataset.price : 0;
      var q = ZC.cart.add({ id: btn.dataset.name + '|' + fmt, name: btn.dataset.name, type: btn.dataset.type, fmt: fmt, price: price, img: btn.dataset.img, href: btn.dataset.href });
      btn.textContent = 'Добавлено  ✓';
      btn.classList.add('is-done');
      clearTimeout(timer);
      timer = setTimeout(function () { btn.textContent = label; btn.classList.remove('is-done'); }, 1800);
      if (added) {
        added.querySelector('[data-added-text]').textContent = 'В корзине: ' + btn.dataset.name + ', ' + fmt + ' × ' + q;
        added.hidden = false;
      }
    });
  });

  /* ---------- Избранное: кнопка ♡ в карточке товара ----------
     Данные товара — из кнопки «Добавить к выбору» (data-name/-type/-img/-href) и выбранного формата. */
  document.querySelectorAll('[data-fav-toggle]').forEach(function (btn) {
    if (!window.ZC || !ZC.fav) return;
    var src = document.querySelector('[data-add-to-cart]');
    if (!src) return;
    var id = src.dataset.name;
    var paint = function () {
      var on = ZC.fav.has(id);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Убрать из избранного' : 'Добавить в избранное');
      btn.title = on ? 'В избранном' : 'В избранное';
    };
    btn.addEventListener('click', function () {
      var f = document.querySelector('.prod__formats input:checked');
      ZC.fav.toggle({ id: id, name: src.dataset.name, type: src.dataset.type, fmt: f ? f.value : '', price: f ? +f.dataset.price : 0, img: src.dataset.img, href: src.dataset.href });
      paint();
    });
    document.addEventListener('zc-fav', paint);
    paint();
  });

  /* ---------- Страница «Избранное» ---------- */
  var favList = document.querySelector('[data-fav-list]');
  if (favList && window.ZC && ZC.fav) {
    var fesc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var renderFav = function () {
      var items = ZC.fav.get(), n = items.length;
      favList.innerHTML = items.map(function (i) {
        return '<article class="pcard fav-card" data-id="' + fesc(i.id) + '">' +
          '<a class="pcard__ph" href="' + fesc(i.href) + '" tabindex="-1" aria-hidden="true">' + (i.img ? '<img src="' + fesc(i.img) + '" alt="" loading="lazy">' : '') + '</a>' +
          '<button class="fav-card__del" type="button" data-fav-del aria-label="Убрать «' + fesc(i.name) + '» из избранного" title="Убрать из избранного"></button>' +
          '<p class="pcard__type">' + fesc(i.type) + '</p>' +
          '<h3 class="pcard__name"><a href="' + fesc(i.href) + '">' + fesc(i.name) + '</a></h3>' +
          '<p class="pcard__price">' + (i.fmt ? fesc(i.fmt) + '  /  ' : '') + rub(i.price || 0) + '</p>' +
          '<button class="fav-card__cart" type="button" data-fav-cart>В корзину  +</button>' +
        '</article>';
      }).join('');
      document.body.classList.toggle('fav-empty', !n);
      document.querySelector('[data-fav-empty]').hidden = !!n;
      document.querySelector('[data-fav-total]').textContent = n + ' ' + (ZC.cart ? ZC.cart.plural(n, ['товар', 'товара', 'товаров']) : 'шт');
    };
    favList.addEventListener('click', function (e) {
      var card = e.target.closest('.fav-card'); if (!card) return;
      var item = ZC.fav.get().filter(function (i) { return i.id === card.dataset.id; })[0]; if (!item) return;
      if (e.target.closest('[data-fav-del]')) { ZC.fav.toggle(item); return; }
      var add = e.target.closest('[data-fav-cart]');
      if (add && ZC.cart) {
        ZC.cart.add({ id: item.name + '|' + item.fmt, name: item.name, type: item.type, fmt: item.fmt, price: item.price, img: item.img, href: item.href });
        add.textContent = 'В корзине  ✓'; add.classList.add('is-done');
        setTimeout(function () { add.textContent = 'В корзину  +'; add.classList.remove('is-done'); }, 1800);
      }
    });
    var clear = document.querySelector('[data-fav-clear]');
    if (clear) clear.addEventListener('click', function () { ZC.fav.set([], false); });
    document.addEventListener('zc-fav', renderFav);
    renderFav();
  }

  /* ---------- Корзина и оформление заказа ----------
     Условия получения — в CO; уточнить у заказчика (срок заказа, стоимость доставки до 2 000 ₽). */
  var CO = {
    freeFrom: 2000,         /* курьер бесплатно от суммы */
    courierDays: [2, 5],    /* вт, пт */
    leadDays: 1,            /* ближайший день получения: завтра */
    pickupDays: 7,          /* сколько дней самовывоза предлагать */
    courierCount: 4         /* сколько ближайших дат курьера предлагать */
  };
  var cartList = document.querySelector('[data-cart-list]');
  if (cartList && window.ZC && ZC.cart) {
    var $ = function (s) { return document.querySelector(s); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var qtyHtml = function (q) {
      var b = function (sp) { return '<button type="button" data-qty-dec aria-label="Меньше">−</button>' + sp + '<output data-qty-out>' + q + '</output>' + sp + '<button type="button" data-qty-inc aria-label="Больше">+</button>'; };
      return '<div class="qty"><span class="only-d">' + b('       ') + '</span><span class="only-t">' + b('      ') + '</span><span class="only-m">' + b('   ') + '</span></div>';
    };
    var form = $('[data-checkout]'), sent = false;
    var receive = function () { var r = form && form.querySelector('input[name="receive"]:checked'); return r ? r.value : 'pickup'; };
    var goods = function () { return ZC.cart.get().reduce(function (s, i) { return s + (+i.price || 0) * (+i.qty || 1); }, 0); };

    var renderSum = function () {
      if (!form) return;
      var g = goods(), n = ZC.cart.count(), courier = receive() === 'courier', free = g >= CO.freeFrom;
      $('[data-sum-qty]').textContent = 'Товары, ' + n + ' шт';
      $('[data-sum-goods]').textContent = rub(g);
      $('[data-sum-receive]').textContent = !courier ? 'Самовывоз · бесплатно' : free ? 'Курьер · бесплатно' : 'Курьер · рассчитает менеджер';
      var left = CO.freeFrom - g;
      $('[data-free-text]').textContent = left > 0 ? 'До бесплатной доставки курьером — ' + rub(left) : 'Доставка курьером — бесплатно  ✓';
      $('[data-free-bar]').style.width = Math.min(100, g / CO.freeFrom * 100) + '%';
      $('[data-free]').classList.toggle('is-done', left <= 0);
      $('[data-cart-total]').textContent = rub(g) + (courier && !free ? ' + доставка' : '');
    };

    var renderCart = function () {
      if (sent) return;
      var items = ZC.cart.get();
      cartList.innerHTML = items.map(function (i) {
        var sum = (+i.price || 0) * (+i.qty || 1);
        return '<article class="cart-item" data-id="' + esc(i.id) + '">' +
          '<a class="cart-item__ph" href="' + esc(i.href) + '">' + (i.img ? '<img src="' + esc(i.img) + '" alt="">' : '') + '</a>' +
          '<div class="cart-item__info">' +
            '<h2 class="cart-item__name"><a href="' + esc(i.href) + '">' + esc(i.name) + '</a></h2>' +
            '<p class="cart-item__meta">' + esc(i.type) + (i.fmt ? '  ·  ' + esc(i.fmt) : '') + '</p>' +
            '<div class="cart-item__row">' + qtyHtml(+i.qty || 1) + '<p class="cart-item__sum">' + rub(sum) + '</p></div>' +
            '<button class="cart-item__del" type="button" data-del>Удалить  ×</button>' +
          '</div></article>';
      }).join('');
      document.body.classList.toggle('cart-empty', !items.length);
      $('[data-cart-empty]').hidden = !!items.length;
      renderSum();
    };
    cartList.addEventListener('click', function (e) {
      var art = e.target.closest('.cart-item'); if (!art) return;
      var inc = e.target.closest('[data-qty-inc]'), dec = e.target.closest('[data-qty-dec]'), del = e.target.closest('[data-del]');
      if (!inc && !dec && !del) return;
      var list = ZC.cart.get().filter(function (i) {
        if (i.id !== art.dataset.id) return true;
        if (del) return false;
        i.qty = Math.max(1, Math.min(99, (+i.qty || 1) + (inc ? 1 : -1)));
        return true;
      });
      ZC.cart.set(list, false);
    });
    document.addEventListener('zc-cart', renderCart);

    if (form) {
      /* --- дни получения --- */
      var WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'], MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      var days = function (courier) {
        var out = [], d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + CO.leadDays);
        while (out.length < (courier ? CO.courierCount : CO.pickupDays)) {
          if (!courier || CO.courierDays.indexOf(d.getDay()) !== -1) out.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
        return out;
      };
      var renderDays = function () {
        var courier = receive() === 'courier', box = $('[data-days]');
        var prev = (form.querySelector('input[name="day"]:checked') || {}).value;
        var tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        box.innerHTML = days(courier).map(function (d) {
          var v = WD[d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()];
          var lbl = d.toDateString() === tomorrow.toDateString() ? 'Завтра, ' + d.getDate() + ' ' + MON[d.getMonth()] : v;
          return '<label class="chip"><input type="radio" name="day" value="' + v + '"' + (v === prev ? ' checked' : '') + '>' + lbl + '</label>';
        }).join('');
        $('[data-days-label]').textContent = courier ? 'День доставки' : 'День самовывоза';
        $('[data-days-hint]').textContent = courier ? 'Доставляем по вторникам и пятницам. Интервал согласует менеджер.' : 'Время выдачи с 10:00 до 19:00 — уточнит менеджер.';
        $('[data-address]').hidden = !courier;
        $('[data-days-field]').classList.remove('is-error');
      };
      var clearErr = function (e) { var f = e.target.closest('.field, .check'); if (f) f.classList.remove('is-error'); };
      form.addEventListener('change', function (e) {
        if (e.target.name === 'receive') { renderDays(); renderSum(); }
        clearErr(e);
      });
      form.addEventListener('input', clearErr);

      /* --- проверка и отправка --- */
      var err = $('[data-co-error]'), submit = $('[data-co-submit]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var items = ZC.cart.get(); if (!items.length) return;
        var courier = receive() === 'courier', bad = null;
        var mark = function (el, ok) { var w = el.closest('.field, .check'); if (w) w.classList.toggle('is-error', !ok); if (!ok && !bad) bad = el; };
        var day = form.querySelector('input[name="day"]:checked');
        mark($('[data-days]'), !!day);
        if (courier) mark(form.elements.address, form.elements.address.value.trim().length > 4);
        mark(form.elements.name, form.elements.name.value.trim() !== '');
        mark(form.elements.phone, form.elements.phone.value.replace(/\D/g, '').length >= 10);
        mark(form.elements.consent, form.elements.consent.checked);
        if (bad) {
          err.textContent = 'Проверьте отмеченные поля'; err.hidden = false;
          (bad.closest('.field, .check') || bad).scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (bad.tagName === 'INPUT') bad.focus({ preventScroll: true });
          return;
        }
        err.hidden = true;
        var g = goods(), free = g >= CO.freeFrom, now = new Date();
        var pad = function (n, l) { n = String(n); while (n.length < l) n = '0' + n; return n; };
        var id = 'ЗЦ-' + pad(now.getDate(), 2) + pad(now.getMonth() + 1, 2) + '-' + pad(now.getHours(), 2) + pad(now.getMinutes(), 2) + Math.floor(Math.random() * 10);
        var lines = items.map(function (i) { return i.name + ', ' + i.fmt + ' × ' + i.qty + ' — ' + rub(i.price * i.qty); });
        var addr = courier ? form.elements.address.value.trim() : '';
        var recv = courier ? 'Курьер, ' + day.value + (free ? ' (бесплатно)' : ' (доставка — рассчитать)') : 'Самовывоз, ТРК «Гранд Каньон», ' + day.value;
        var channel = form.querySelector('input[name="channel"]:checked').value;
        var data = {
          order_id: id, items: lines.join('\n'), total: rub(g) + (courier && !free ? ' + доставка' : ''),
          receive: recv, address: addr, name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(),
          channel: channel, comment: form.elements.comment.value.trim(), consent: 'да'
        };
        submit.disabled = true; submit.textContent = 'Отправляем…';
        ZC.send('order', data).then(function () {
          sent = true;
          $('[data-done-num]').textContent = 'ЗАКАЗ  ' + id;
          $('[data-done-channel]').textContent = channel === 'Telegram' ? 'напишет в Telegram' : 'позвонит';
          $('[data-done-phone]').textContent = data.phone;
          $('[data-done-list]').innerHTML = lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
          $('[data-done-receive]').textContent = recv + (addr ? ' · ' + addr : '');
          $('[data-done-total]').textContent = data.total;
          document.body.classList.add('co-sent');
          $('[data-co-done]').hidden = false;
          ZC.cart.set([], false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, function () {
          err.innerHTML = 'Не получилось отправить заказ. Попробуйте ещё раз или позвоните: <a href="tel:+79893573333">+7 (989) 357-33-33</a>';
          err.hidden = false;
        }).then(function () { submit.disabled = false; submit.textContent = 'Отправить заказ'; });
      });
      renderDays();
    }
    renderCart();
  }

  /* ---------- Форма заявки (торт на заказ) → ZC.send('cake', …) ---------- */
  document.querySelectorAll('[data-order-form]').forEach(function (form) {
    form.querySelectorAll('input[type="date"][data-min-days]').forEach(function (d) {
      var t = new Date(); t.setDate(t.getDate() + (+d.dataset.minDays || 0));
      d.min = t.toISOString().slice(0, 10);
    });
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field, .check');
      if (f) f.classList.remove('is-error');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var ok = inp.type === 'checkbox' ? inp.checked
          : inp.type === 'tel' ? inp.value.replace(/\D/g, '').length >= 10
          : inp.value.trim() !== '';
        var wrap = inp.closest('.field, .check');
        if (wrap) wrap.classList.toggle('is-error', !ok);
        if (!ok && !bad) bad = inp;
      });
      if (bad) { bad.focus(); return; }
      var data = {};
      [].forEach.call(form.elements, function (el) {
        if (!el.name || (el.type === 'radio' && !el.checked)) return;
        data[el.name] = el.type === 'checkbox' ? (el.checked ? 'да' : 'нет') : el.value.trim();
      });
      var btn = form.querySelector('[type="submit"]'), label = btn.textContent;
      var fail = form.querySelector('.form__fail');
      if (fail) fail.remove();
      btn.disabled = true; btn.textContent = 'Отправляем…';
      var send = window.ZC && ZC.send ? ZC.send('cake', data) : Promise.resolve();
      send.then(function () {
        form.classList.add('is-sent');
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, function () {
        btn.insertAdjacentHTML('afterend', '<p class="form__fail" role="alert">Не получилось отправить заявку. Попробуйте ещё раз или позвоните: <a href="tel:+79893573333">+7 (989) 357-33-33</a></p>');
      }).then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });

  /* ---------- Копирование промокода ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { var t = b.textContent; b.textContent = 'Скопировано'; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
    });
  });

  /* ---------- Листинг: выпадающие «Фильтры» и «Сортировка» ----------
     Группы фильтров строятся из карточек на странице: тип (по подписи карточки),
     вкус (data-taste), цена (из «… ₽»). Группа показывается, если в ней ≥ 2 варианта. */
  var grid = document.querySelector('.pgrid');
  var dds = [].slice.call(document.querySelectorAll('[data-dd]'));
  if (grid && dds.length) {
    var TYPE = { 'Пирожное': 'Пирожные', 'Конфета': 'Конфеты', 'Корзиночка': 'Корзиночки', 'Набор': 'Наборы', 'Смузи': 'Напитки' };
    var GROUPS = [
      { key: 'type', title: 'ТИП ДЕСЕРТА', opts: null },
      { key: 'taste', title: 'ВКУС', opts: [['berry', 'Ягодные'], ['citrus', 'Цитрусовые и тропические'], ['choco', 'Шоколад и кофе'], ['caramel', 'Карамель и орехи'], ['fresh', 'Свежие']] },
      { key: 'band', title: 'ЦЕНА', opts: [['low', 'До 250 ₽'], ['mid', '251–500 ₽'], ['high', 'От 500 ₽']] }
    ];
    var cards = [].slice.call(grid.querySelectorAll('.pcard'));
    cards.forEach(function (c, i) {
      var m = (c.querySelector('.pcard__price') || {}).textContent || '';
      var p = parseInt((m.match(/([\d\s ]+)₽/) || [0, '0'])[1].replace(/\D/g, ''), 10) || 0;
      var t = (c.querySelector('.pcard__type') || {}).textContent || '';
      c.dataset.idx = i;
      c.dataset.price = p;
      c.dataset.type = TYPE[t.trim()] || t.trim();
      c.dataset.band = p <= 250 ? 'low' : p <= 500 ? 'mid' : 'high';
      c.dataset.name = ((c.querySelector('.pcard__name') || {}).textContent || '').trim();
    });

    var desk = window.matchMedia('(min-width: 1200px)');
    function shown(c) { return !(c.classList.contains('only-d') && !desk.matches); }
    function plural(n) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'товар' : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? 'товара' : 'товаров'; }

    /* --- фильтры --- */
    var fWrap = document.querySelector('[data-flt-groups]');
    var applyBtn = document.querySelector('[data-flt-apply]');
    var badge = document.querySelector('[data-flt-count]');
    var empty = document.querySelector('[data-flt-empty]');
    var applied = {};
    if (fWrap) {
      GROUPS.forEach(function (g) {
        var present = {};
        cards.forEach(function (c) { var v = c.dataset[g.key]; if (v && shown(c)) present[v] = (present[v] || 0) + 1; });
        var opts = g.opts ? g.opts.filter(function (o) { return present[o[0]]; })
                          : Object.keys(present).map(function (v) { return [v, v]; });
        if (opts.length < 2) return;
        var html = '<div class="dd__group"><p class="dd__label">' + g.title + '</p><div class="dd__chips">';
        opts.forEach(function (o) {
          html += '<label class="fchip"><input type="checkbox" name="' + g.key + '" value="' + o[0] + '"><span>' + o[1] + '</span><small>' + present[o[0]] + '</small></label>';
        });
        fWrap.insertAdjacentHTML('beforeend', html + '</div></div>');
      });
      if (!fWrap.children.length) fWrap.innerHTML = '<p class="dd__label">В этом разделе нечего фильтровать</p>';
    }
    function readSel() {
      var s = {};
      fWrap.querySelectorAll('input:checked').forEach(function (i) { (s[i.name] = s[i.name] || []).push(i.value); });
      return s;
    }
    function fits(c, s) { return Object.keys(s).every(function (k) { return s[k].indexOf(c.dataset[k]) !== -1; }); }
    function preview() {
      var s = readSel(), n = cards.filter(function (c) { return shown(c) && fits(c, s); }).length;
      applyBtn.textContent = n ? 'Показать ' + n + ' ' + plural(n) : 'Ничего не найдено';
      applyBtn.disabled = !n;
    }
    function apply(s) {
      applied = s;
      var n = 0, active = 0;
      cards.forEach(function (c) { var ok = fits(c, s); c.hidden = !ok; if (ok && shown(c)) n++; });
      Object.keys(s).forEach(function (k) { active += s[k].length; });
      badge.textContent = active; badge.hidden = !active;
      if (empty) empty.hidden = n > 0;
    }
    function syncChips() {
      fWrap.querySelectorAll('input').forEach(function (i) { i.checked = (applied[i.name] || []).indexOf(i.value) !== -1; });
      preview();
    }
    if (fWrap) {
      fWrap.addEventListener('change', preview);
      applyBtn.addEventListener('click', function () { apply(readSel()); closeAll(); });
      document.querySelectorAll('[data-flt-reset]').forEach(function (b) {
        b.addEventListener('click', function () { fWrap.querySelectorAll('input').forEach(function (i) { i.checked = false; }); apply({}); preview(); });
      });
      preview();
    }

    /* --- сортировка --- */
    var sortLabel = document.querySelector('[data-sort-label]');
    document.querySelectorAll('input[name="sort"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var v = r.value, list = cards.slice();
        if (v === 'price-asc') list.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
        else if (v === 'price-desc') list.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
        else if (v === 'name') list.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name, 'ru'); });
        else list.sort(function (a, b) { return a.dataset.idx - b.dataset.idx; });
        list.forEach(function (c) { grid.appendChild(c); });
        if (sortLabel) sortLabel.textContent = r.parentNode.textContent.trim();
        closeAll();
      });
    });

    /* --- открытие / закрытие --- */
    var backdrop = document.createElement('div');
    backdrop.className = 'dd-backdrop';
    document.body.appendChild(backdrop);
    function closeAll() {
      dds.forEach(function (d) {
        var b = d.querySelector('[data-dd-btn]'), p = d.querySelector('[data-dd-panel]');
        if (!p.hidden && d.classList.contains('dd--filter')) syncChips();
        b.setAttribute('aria-expanded', 'false'); p.hidden = true;
      });
      document.body.classList.remove('dd-open');
    }
    dds.forEach(function (d) {
      var b = d.querySelector('[data-dd-btn]'), p = d.querySelector('[data-dd-panel]');
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = p.hidden;
        closeAll();
        if (open) { p.hidden = false; b.setAttribute('aria-expanded', 'true'); document.body.classList.add('dd-open'); }
      });
      p.addEventListener('click', function (e) { e.stopPropagation(); if (e.target.closest('[data-dd-close]')) closeAll(); });
    });
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

})();
