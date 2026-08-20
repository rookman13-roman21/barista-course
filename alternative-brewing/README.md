# Курс «Альтернативное заваривание кофе» — локальный preview

Страница собрана для безопасных визуальных правок. Локальный preview не является
production-версией и не содержит подключений к booking API. Tilda-страница
`/alternative` на этой стадии не изменяется.

## Запуск

Из папки `barista-course`:

```bash
python3 -m http.server 3216
```

Открыть: `http://localhost:3216/alternative-brewing/`.

## Что можно править

- `index.html` — структура, тексты и ссылки на изображения;
- `styles.css` — визуальный стиль, сетка и адаптивность;
- `preview.js` — исключительно безопасная демо-логика окна записи.

## Tilda-пакет: тренеры, SEO и запись

- `tilda-blocks/00-seo.html` — отдельный head-блок для ручной вставки в Tilda;
- `tilda-blocks/01-hero-and-for-whom.html` — hero и «Кому подойдёт»;
- `tilda-blocks/02-course-content.html` — программа, оборудование, FAQ и CTA;
- `tilda-blocks/09-online-booking-popup.html` — production popup без yClients
  URL и секретов; он подключает общий виджет по slug `alternative-brewing`;
- `tilda-blocks/10-page-interactions.html` — интерактив программы, FAQ и галереи.

Файлы `01`, `02` и `10` генерируются из local preview командой:

```bash
node scripts/build-tilda-blocks.js
```

Порядок Tilda-блоков и их назначение остаются в `tilda-blocks/README.md`.
Реальная онлайн-запись работает только через отдельно выложенный конфиг
`alternative-brewing` в `schedule-online`; локальный preview по-прежнему не
создаёт записи.
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

Настоящее подключение к двум занятиям находится вне preview: оно использует
общий production-виджет и может меняться только отдельным C-пакетом с review.
