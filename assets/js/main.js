/* NETIZ — main.js. Ваниль, без зависимостей, без сборки.
   Только UI-поведение: мобильное меню, меню каталога, аккордеон FAQ.
   Валидацию и отправку форм делает Битрикс. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Мобильное меню */
  var menu = $('#mobile-menu');
  var menuBackdrop = $('.backdrop--blur');
  function openMenu() { menu.classList.add('is-open'); menuBackdrop.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { menu.classList.remove('is-open'); menuBackdrop.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  if (menu) {
    $$('[data-menu-open]').forEach(function (b) { b.addEventListener('click', openMenu); });
    $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', closeMenu); });
  }

  /* Меню каталога */
  var catBtn = $('[data-catalog-toggle]');
  var catMenu = $('#catalog-menu');
  var catBackdrop = $('[data-catalog-close]');
  function setCat(open) {
    if (!catMenu) return;
    catMenu.classList.toggle('is-open', open);
    catBackdrop.classList.toggle('is-open', open);
    catBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (catBtn) {
    catBtn.addEventListener('click', function () { setCat(!catMenu.classList.contains('is-open')); });
    catBackdrop.addEventListener('click', function () { setCat(false); });
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); setCat(false); setFilter(false); } });

  /* Мобильный фильтр каталога (offcanvas) */
  var filterAside = $('#filter-aside');
  var filterBackdrop = $('[data-filter-close].backdrop');
  function setFilter(open) {
    if (!filterAside) return;
    filterAside.classList.toggle('is-open', open);
    if (filterBackdrop) filterBackdrop.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  $$('[data-filter-open]').forEach(function (b) { b.addEventListener('click', function () { setFilter(true); }); });
  $$('[data-filter-close]').forEach(function (b) { b.addEventListener('click', function () { setFilter(false); }); });
  $$('.filter__group-head').forEach(function (h) {
    h.addEventListener('click', function () { h.parentElement.classList.toggle('is-collapsed'); });
  });

  /* Выпадающие списки (сортировка) */
  $$('[data-dropdown]').forEach(function (dd) {
    var toggle = dd.querySelector('button');
    toggle.addEventListener('click', function (e) { e.stopPropagation(); dd.classList.toggle('is-open'); });
    $$('.toolbar__sort-opt', dd).forEach(function (opt) {
      opt.addEventListener('click', function () {
        $$('.toolbar__sort-opt', dd).forEach(function (o) { o.classList.remove('is-active'); });
        opt.classList.add('is-active');
        var label = toggle.childNodes; for (var i = 0; i < label.length; i++) { if (label[i].nodeType === 3 && label[i].textContent.trim()) { label[i].textContent = opt.textContent; break; } }
        dd.classList.remove('is-open');
      });
    });
  });
  document.addEventListener('click', function () { $$('[data-dropdown].is-open').forEach(function (d) { d.classList.remove('is-open'); }); });

  /* Свёрнутый SEO-текст */
  $$('[data-seo]').forEach(function (b) {
    var btn = b.querySelector('.seo-text__more');
    btn.addEventListener('click', function () {
      var open = b.classList.toggle('is-open');
      btn.textContent = open ? 'Свернуть ↑' : 'Читать далее ↓';
    });
  });

  /* Табы карточки товара */
  $$('.tabs').forEach(function (tabs) {
    $$('[data-tab]', tabs).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-tab]', tabs).forEach(function (b) { b.classList.remove('is-active'); });
        $$('[data-panel]', tabs).forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-panel') === btn.getAttribute('data-tab')); });
        btn.classList.add('is-active');
      });
    });
  });

  /* Галерея: миниатюра → главное фото */
  $$('.gallery').forEach(function (g) {
    var main = $('.gallery__main img', g);
    $$('.gallery__thumb', g).forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.gallery__thumb', g).forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        var img = t.querySelector('img'); if (main && img) { main.src = img.getAttribute('data-full') || img.src; }
      });
    });
  });

  /* Степпер количества */
  $$('.stepper').forEach(function (st) {
    var input = $('.stepper__val', st), btns = $$('.stepper__btn', st);
    function set(v) { input.value = Math.max(parseInt(input.min || '1', 10), v || 1); input.dispatchEvent(new Event('change', { bubbles: true })); }
    if (btns[0]) btns[0].addEventListener('click', function () { set(parseInt(input.value, 10) - 1); });
    if (btns[1]) btns[1].addEventListener('click', function () { set(parseInt(input.value, 10) + 1); });
  });

  /* Звёзды в форме отзыва */
  $$('[data-stars]').forEach(function (w) {
    var hidden = w.querySelector('input[type=hidden]'), hint = w.querySelector('.stars-input__hint');
    var labels = ['', 'Плохо', 'Так себе', 'Нормально', 'Хорошо', 'Отлично'];
    $$('[data-star]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(b.getAttribute('data-star'), 10);
        $$('[data-star]', w).forEach(function (x) { x.classList.toggle('is-on', parseInt(x.getAttribute('data-star'), 10) <= n); });
        if (hidden) hidden.value = n; if (hint) hint.textContent = labels[n];
      });
    });
  });

  /* Реквизиты: копирование */
  $$('[data-requisites]').forEach(function (w) {
    function copy(text, btn) {
      var done = function () { if (btn) { btn.classList.add('is-copied'); setTimeout(function () { btn.classList.remove('is-copied'); }, 1200); } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
    }
    w.addEventListener('click', function (e) {
      var all = e.target.closest('[data-copy-all]');
      if (all) { copy($$('.req__row', w).map(function (r) { return $('.req__label', r).textContent + ': ' + $('.req__val span', r).textContent; }).join('\n'), all); return; }
      var one = e.target.closest('[data-copy]'); if (one) copy(one.getAttribute('data-copy'), one);
    });
  });

  /* FAQ */
  $$('.faq__item').forEach(function (item) {
    item.addEventListener('click', function () { item.classList.toggle('is-open'); });
  });
})();
