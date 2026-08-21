# Отдельные блоки для Tilda

## Порядок размещения

1. В head страницы вставить `00-seo.html` и задать Title:
   `Курс «Латте-арт» в Москве — 9 часов практики | MBS`.
2. Первым HTML-блоком страницы вставить `01-hero-and-for-whom.html`.
3. Сразу после него добавить штатный блок тренеров:
   `../../tilda_blocks_others/trainers-widget/tilda-block.html`.
4. Следующим HTML-блоком вставить `02-course-content.html`.
5. После CTA добавить один раз `09-online-booking-popup.html`.
6. Последним HTML-блоком вставить `10-page-interactions.html`.

`01`, `02` и `10` генерируются из local preview:

```bash
node scripts/build-tilda-blocks.js
```

`09-online-booking-popup.html` передаёт только slug `latte-art` общему
`course-booking-widget.js`. Не добавлять в этот блок токены, данные yClients
или логику создания визита.

CTA «Оставить заявку» ведут на штатный Tilda popup через `href="#consalt"`.
Не создавать на странице реальный элемент с `id="consalt"`: иначе ссылка
будет работать как якорь, а не как popup. Telegram, WhatsApp и телефон
остаются отдельными контактными ссылками.

Подготовка файлов не означает публикацию. Для выпуска нужны независимый review
и явное решение Романа; вставка и публикация в Tilda выполняются вручную.
