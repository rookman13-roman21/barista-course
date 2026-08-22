# Tilda-блоки: Профессиональный курс бариста

Это локальный release-пакет для существующей страницы `/expert`. Его наличие
не означает публикацию.

## Порядок ручной вставки

1. SEO-настройки Tilda не заменять: у страницы уже есть собственные Title,
   description, keywords, Open Graph и canonical. Отдельный `00-seo.html`
   намеренно не создаётся.
2. Первым HTML-блоком вставить `01-hero-and-for-whom.html`.
3. Сразу после него добавить актуальный отдельный блок тренеров:
   `../../tilda_blocks_others/trainers-widget/tilda-block.html`.
4. Следующим HTML-блоком вставить `02-course-content.html`.
5. После CTA вставить один раз `09-online-booking-popup.html`.
6. Последним HTML-блоком вставить `10-page-interactions.html`.

`01`, `02`, `09` и `10` не редактировать вручную: они создаются командой
из корня `barista-course`:

```bash
node professional-barista/scripts/build-tilda-blocks.js
```

## Границы CTA

- `Онлайн запись` открывает popup и передаёт виджету только slug
  `professional-barista`;
- `Оставить заявку` всегда использует `href="#consalt"`;
- не создавать на странице реальный элемент с `id="consalt"`;
- Telegram, WhatsApp и телефон остаются отдельными контактами.

Для работы виджета требуется отдельный backend-конфиг
`schedule-online/basic-barista-booking/courses/professional-barista.json` с
подтверждёнными ID услуг yClients. До его независимого review, safe
`check_only` и явного решения Романа «выкладывай» не вставлять блоки в Tilda
и не публиковать страницу.
