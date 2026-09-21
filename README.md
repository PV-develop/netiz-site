# НЭТИЗ — вёрстка для интеграции в 1С-Битрикс

Статичная вёрстка. Без сборщика, без фреймворков, без внешних запросов:
шрифты и картинки локально, JS — ваниль.

## Структура

```
index.html            главная (собранная, открывать в браузере)
section.html          раздел каталога: фильтр, сортировка, сетка товаров, пагинация
product.html          карточка товара: галерея, сводка покупки, табы, характеристики, отзывы
service.html          детальная запись (услуга) — шаблон для кейса, статьи и текстовых страниц
contacts.html         контакты: способы связи, карта, форма, реквизиты, отдел продаж
services.html, cases.html, blog.html, reviews.html, certificates.html — листинги (T4)
case.html, post.html   детальные кейс и статья (T5 без price-from и form--compact)
page.html, requisites.html, about.html — текстовые страницы (T6)
ui.html               UI-кит: все компоненты и состояния
src/                  исходники страниц с <!-- @include partials/... -->
partials/header.html  → header.php шаблона
partials/footer.html  → footer.php (включая блок «Пришлем каталог»)
partials/lead-form.html  блок «Подберём батарею» — включается на главной, в разделах, в карточке
partials/map-russia.svg  карта в секции «География»
partials/block-catalog.html, block-cases.html, block-news.html — повторяющиеся секции перелинковки
partials/services-grid.html  сетка услуг
assets/css/main.css   ЕДИНСТВЕННЫЙ css: токены, база, компоненты, адаптив
assets/css/fonts.css  @font-face (Onest, Unbounded)
assets/js/main.js     меню, фильтр, сортировка, табы, галерея, степпер, звёзды, FAQ, SEO-текст
assets/img/           логотип, hero, фон лид-формы, фото «о компании», плейсхолдеры
assets/fonts/         woff2 (cyrillic + latin)
build.py              python3 build.py — пересобрать *.html из src/ + partials/
```

Редактировать страницы нужно в `src/`, потом `python3 build.py`.
Готовые `index.html` / `ui.html` в корне — только результат сборки.

## Принципы разметки

- **BEM**: `block__element`, `block--modifier`; состояния — `.is-open`, `.is-active`,
  `.is-error`, `.is-success`, `.is-disabled`.
- **Без инлайн-стилей.** Единичные `style="margin-top:…"` в src — это композиционные
  отступы внутри секций; при переносе можно оставить или вынести в класс.
- **Повторяющиеся элементы** размечены один раз с комментарием
  `<!-- xxx: item ×N -->` — оборачивать в `foreach` компонента.
- Кнопки-ссылки — `<a class="btn">`, кнопки действий — `<button class="btn">`.
- Иконки — inline SVG со `stroke="currentColor"`, цвет наследуется от контейнера.

## Карта: секция → компонент Битрикс

| Секция главной | Компонент / источник | Разметка |
|---|---|---|
| Верхнее меню, моб. меню | `bitrix:menu` (top) | `.topbar__nav a`, `.mobile-menu__nav a` |
| Меню каталога в шапке | `bitrix:catalog.section.list` | `.catalog-menu__item` |
| Поиск | `bitrix:search.title` | `.field.field--sm` |
| Сравнение / избранное / корзина | `bitrix:sale.basket.basket.line` | `.icon-btn`, счётчик `.icon-btn__badge` |
| Hero | статика в шаблоне или ИБ «Баннеры» | `.hero` |
| Преимущества | статика / ИБ «Преимущества» | `.feature` |
| Разделы каталога | `bitrix:catalog.section.list` | `.cat-card`; иконка — свойство раздела (SVG) |
| Кейсы | `bitrix:news.list`, ИБ «Кейсы» | `.case-card`; свойства TAG, METRIC_1(_LABEL), METRIC_2(_LABEL) |
| Отзывы | `bitrix:news.list`, ИБ «Отзывы» | `.review` |
| География | статика | `.plate--soft` + `partials/map-russia.svg` |
| Лид-форма «Подберём батарею» | `bitrix:main.feedback` / свой компонент, с файлом | `.form.glass`, поля `.field--glass` |
| О компании | статика | `.about` |
| Новости | `bitrix:news.list`, ИБ «Новости» | `.news-card` |
| FAQ | ИБ «Вопросы» / статика | `.faq__item` (`.is-open`) |
| «Пришлем каталог» (в футере) | `bitrix:main.feedback` | `.subscribe` |
| Колонки футера | `bitrix:menu` (bottom_catalog, bottom_company) | `.footer__links a` |

## Раздел каталога (section.html)

| Блок | Компонент / источник | Разметка |
|---|---|---|
| Крошки + H1 + лид | `bitrix:breadcrumb`, название и DESCRIPTION раздела | `.page-head`, `.breadcrumbs` |
| Облако тегов | подразделы или свойство раздела | `.tag-cloud .tag` (`.is-active`) |
| Фильтр | `bitrix:catalog.smart.filter` | `.filter`, группы `.filter__group` (`.is-collapsed`), выбранные `.filter__pick`, диапазон `.filter__range`, недоступная опция `.check.is-disabled`. Мобильный offcanvas: `.listing__aside.is-open` + `[data-filter-open]/[data-filter-close]` |
| Тулбар | счётчик, сортировка (`.toolbar__sort` + `[data-dropdown]`), вид | `.toolbar` |
| Сетка товаров | `bitrix:catalog.section` | `.grid--products .product-card`; цена / `--request`; наличие `.is-in`; бейдж — свойство |
| Пустая выдача | закомментирована в разметке | `.empty` |
| Пагинация | `bitrix:system.pagenavigation` | `.pagination` |
| Смежные разделы | `bitrix:catalog.section.list` | `.cat-card` |
| Отрасли | ИБ «Отрасли» | `.industry-card` |
| FAQ + кнопка | свойство раздела / ИБ «Вопросы» | `.faq`, `.faq-cta` |
| SEO-текст | DESCRIPTION раздела (нижний) | `.seo-text` (`.is-open`), `[data-seo]` |

Фото товара — 600×600, контейнер `.product-card__media` квадратный, `object-fit: contain`, `mix-blend-mode: multiply` (фото на белом фоне ложится на серую плашку без рамки).

## Карточка товара (product.html)

| Блок | Компонент / источник | Разметка |
|---|---|---|
| Крошки | `bitrix:breadcrumb` | `.breadcrumbs` |
| Галерея | DETAIL_PICTURE + MORE_PHOTO | `.gallery`, миниатюры `.gallery__thumb` (`.is-active`, `data-full` — путь к большому фото) |
| Заголовок, артикул, бренд, рейтинг | `bitrix:catalog.element` | `.pdp__aside`, `.pdp__meta`, `.rating` |
| Ключевые характеристики | 4–5 свойств с флагом «в сводку» | `.keyspecs .keyspec` |
| Сводка покупки | цена, наличие, количество, кнопки | `.buybox`: с ценой (`.buybox__price` + `.stepper`), без цены (`.buybox__request`, кнопка «Запросить цену», без степпера), под заказ (цена + `.chip` «Под заказ»). Все три — в ui.html |
| Консультация | ссылка на #lead | `.pdp__consult` |
| Табы | описание / характеристики / отзывы (якорь) / как купить / доставка | `.tabs`: `[data-tab]` ↔ `[data-panel]`, активные — `.is-active` |
| Характеристики | свойства товара, сгруппированные | `.specs__group`, `.specs__row`; документы — `.docs` |
| Отзывы | ИБ «Отзывы» с привязкой к товару | `.rsum` + `.rbars` (сводка), `.review`, форма `.review-form` с `[data-stars]` (hidden `rating`) |
| Похожие | `bitrix:catalog.section` того же раздела | `.grid--products .product-card` |
| Далее | лид-форма, разделы, кейсы, новости, подвал | как на главной |

## Детальная запись (service.html)

| Блок | Компонент / источник | Разметка |
|---|---|---|
| Крошки, H1, лид, метрики, фото | `bitrix:news.detail` (ИБ «Услуги»); свойства METRIC_1..3, DETAIL_PICTURE | `.page-head`, `.svc-hero`, `.metrics` |
| Цена от | свойство PRICE_FROM | `.price-from` (`__value` или `__request`) |
| Текст | DETAIL_TEXT из визуального редактора | `.article`: `__h2`, `__h3`, `p`, `__list`, `__table`, `__note`, `__figure`, `__quote`. Классы можно вешать через стили редактора или преобразовывать h2→`.article__h2` на выводе |
| Этапы | свойство-таблица или статичный HTML в тексте | `.steps .step` (`--dark` — последний) |
| Компактная форма | `bitrix:main.feedback` | `.form--compact` (тёмная плашка, поля `field--dark`) |
| Другие услуги | `bitrix:news.list` того же ИБ | `.grid--services .service-card` |
| Далее | разделы, кейсы, статьи, лид-форма, подвал | как на главной |

Кейс и статья — тот же шаблон без `price-from` и `form--compact`; текстовые страницы (оплата, доставка, о компании) — `.article` без первого экрана.

## Листинги (T4) и текстовые (T6)

| Страница | Компонент | Разметка |
|---|---|---|
| services.html | `bitrix:news.list` ИБ «Услуги» | `.grid--services .service-card` |
| cases.html | `bitrix:news.list` ИБ «Кейсы» + фильтр по отрасли | `.tag-cloud` (ссылки на ?tag=), `.grid--3 .case-card`, `.pagination` |
| blog.html | `bitrix:news.list` ИБ «Новости» | `.tag-cloud`, `.grid--news .news-card` |
| reviews.html | `bitrix:news.list` ИБ «Отзывы» | `.rsum`, `.reviews-grid .review`, `.review-form` |
| certificates.html | `bitrix:news.list` ИБ «Сертификаты» | `.grid--cards .cert-card` (фото 600×800, ссылка на PDF), `.docs` |
| case.html, post.html | `bitrix:news.detail` | `.svc-hero` + `.article`; «другие кейсы / читайте также» — `news.list` с исключением текущего |
| page.html, requisites.html | статические страницы раздела «Покупателям» | `.text-layout` = `.side-nav` (`bitrix:menu` left) + `.article` |
| about.html | статическая страница | `.svc-hero` (фото 300 px, под ним `.metrics--grid`) + `.article` + блоки главной (преимущества, география) + сертификаты + кейсы |

`.text-layout` ≤900px: боковое меню превращается в ряд чипов над текстом.

## Контакты (contacts.html)

| Блок | Компонент / источник | Разметка |
|---|---|---|
| Способы связи | статика в шаблоне / настройки сайта | `.grid--contacts .contact-card` (`__value--phone`, `__value--sm`, мессенджеры в `__foot`) |
| Карта | `<iframe>` Яндекс.Карт внутрь `.map-embed__frame` вместо плейсхолдера | `.map-embed`, подпись `.map-embed__caption` |
| Как добраться | статика | `.route .route__item` |
| Форма | `bitrix:main.feedback` | `.contact-form`, поля `field`, `field--select` (нативный `<select>`), `field--area`; результат — `.form.is-success/.is-error` показывают `.form__message` |
| Реквизиты | статика / свойства сайта | `.requisites` + `[data-requisites]`; кнопки `[data-copy]` и `[data-copy-all]` копируют в буфер (JS) |
| Отдел продаж | ИБ «Сотрудники» — блок опциональный | `.grid--persons .person-card` |

## Формы

- Поле — `<label class="field"><input class="field__input" placeholder=" "><span class="field__label">`.
  Плавающий лейбл работает на `:placeholder-shown`, поэтому `placeholder=" "` обязателен.
- Ошибка: `.field.is-error` + следующий `.field__error` (текст).
- Результат отправки: `.form.is-success` / `.form.is-error` показывают
  `.form__message--ok` / `.form__message--err`.
- Модификаторы фона: `.field--glass` (на фото), `.field--dark` (на тёмном), `.field--sm` (шапка).
- Валидацию и AJAX-отправку делает Битрикс; в JS формы не трогаются.

## Заготовки для внутренних страниц (уже есть в main.css и ui.html)

`.breadcrumbs`, `.pagination` (`.is-active`, `.is-disabled`), `.empty` (пустая выдача
фильтра), `.alert--ok/--err`, `.cert-card`.

## Картинки

| Где | Размер | Комментарий |
|---|---|---|
| Кейсы, новости (PREVIEW_PICTURE) | 800×500 | `CFile::ResizeImageGet`, 16:10 |
| Аватар отзыва | 104×104 | круглый, показывается 52 px |
| Сертификат | 600×800 | 3:4 |
| Товар в сетке | 600×600 | на белом фоне, `object-fit: contain` |
| Товар в карточке | 800×600 (+ миниатюры 600×600) | галерея 4:3 |
| Hero | 2400×813 | статичный `assets/img/hero.jpg` |
| О компании | 1600×1200 | статичный |

Фото кейсов и статей (`case-*.jpg`, `news-*.jpg`) — сгенерированные заглушки 800×500, заменить реальными. Плейсхолдеры `placeholder-*.svg` — тоже.

## Брейкпоинты

| ≤ px | Что меняется |
|---|---|
| 1320 | скрывается верхняя полоска (nav + контакты), появляется бургер |
| 1100 | скрываются подписи под иконками и поиск в шапке (поиск уходит в моб. меню); фильтр каталога уходит в offcanvas, появляется кнопка «Фильтр» |
| 760 | скрываются телефон и кнопка «Каталог» в шапке (уходят в моб. меню); hero — чипы над заголовком; подписи городов на карте скрыты |
| 560 | сетка товаров 2 колонки, в карточке скрыты названия параметров |
| 420 | h1 30px |

Сетки карточек — `auto-fit/auto-fill`, ломаются сами, без медиазапросов.

## Шрифты

Onest 400/500/600 (текст), Unbounded 300/400/600 (заголовки). Подключены через
`fonts.css`, `font-display: swap`. Google Fonts не используется.
