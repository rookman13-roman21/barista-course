# Продвинутый курс бариста — локальный preview

Страница собрана для визуальных правок до публикации в Tilda. Локальный preview
не является production-версией и не содержит подключений к booking API.

## Запуск

Из папки `barista-course`:

```bash
python3 -m http.server 3216
```

Открыть: `http://localhost:3216/advanced-barista/`.

## Что можно править

- `index.html` — структура, тексты и ссылки на изображения;
- `styles.css` — визуальный стиль, сетка и адаптивность;
- `preview.js` — исключительно безопасная демо-логика окна записи.

## Tilda-пакет: тренеры, SEO и запись

- `tilda-blocks/00-seo.html` — отдельный head-блок для ручной вставки в Tilda;
- `tilda-blocks/01-hero-and-for-whom.html` — hero и «Кому подойдёт»;
- `tilda-blocks/02-course-content.html` — программа, оборудование, FAQ и CTA;
- `tilda-blocks/09-online-booking-popup.html` — production popup без yClients
  URL и секретов; он подключает общий виджет по slug `advanced-barista`;
- `tilda-blocks/10-page-interactions.html` — интерактив программы, FAQ и галереи.

Файлы `01`, `02` и `10` генерируются из local preview командой:

```bash
node scripts/build-tilda-blocks.js
```

Перед ручной вставкой в Tilda нужно использовать порядок из
`tilda-blocks/README.md`. Сам по себе Tilda-пакет не включает реальную запись:
он станет рабочим только после отдельного deploy-конфига в `schedule-online`.
- Публичный блок тренеров не копируется в эту папку. В Tilda его нужно
  разместить отдельным HTML-блоком после «Кому подойдёт», используя
  `../tilda_blocks_others/trainers-widget/tilda-block.html`.

В local preview блок тренеров намеренно не подгружается: его production-версия
читает актуальный публичный JSON с `api.barista-school.ru`. Это сохраняет
локальный preview независимым от production-инфраструктуры.

## Важная защита preview

`preview.js` не содержит `fetch`, form submit, URL booking API или перехода к
оплате. Последняя кнопка показывает только демонстрацию подтверждения, поэтому
из локальной страницы невозможно создать запись в yClients.

Настоящее подключение к шести услугам — отдельный release-пакет после C-review
и явного решения Романа о публикации.
