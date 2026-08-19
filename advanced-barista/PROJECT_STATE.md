# Продвинутый курс бариста

- Статус: локальный release candidate, не опубликован.
- Исходная Tilda-страница: `20400385`, путь `/probarista`.
- Дата снимка исходника: 2026-08-19 (read-only Tilda API).
- Цены для preview: один участник — 35 000 ₽, два участника — 45 000 ₽.
- Предоплата: 5 000 ₽.
- Программа: 6 занятий по 3 часа.

## Граница текущего этапа

`index.html` и `preview.js` намеренно не содержат реальный booking API, оплату
или запись в yClients и Google Sheets: окно записи там демонстрационное и не
может создавать реальные визиты. Tilda-артефакты вынесены отдельно в
`tilda-blocks/`, чтобы не нарушать эту границу.

Подготовленный, но ещё не выпущенный production-пакет включает:

1. `schedule-online/basic-barista-booking/courses/advanced-barista.json` с
   шестью последовательными занятиями, вариантами на одного и двух участников,
   5 000 ₽ предоплаты и manager-flow.
2. Cron-синхронизацию слотов вместе с остальными индивидуальными курсами.
3. Отдельные Tilda-блоки с общим виджетом `advanced-barista`.
4. SEO head-блок и штатный публичный блок тренеров.

До production остаются: финальный независимый C-review готового diff и явное
решение Романа о deploy `schedule-online` и публикации страницы в Tilda.

## Отдельные Tilda-блоки

- SEO: `advanced-barista/tilda-blocks/00-seo.html` вставляется в head страницы.
- Тренеры: канонический отдельный блок —
  `tilda_blocks_others/trainers-widget/tilda-block.html`. Разместить после
  «Кому подойдёт»; не дублировать его разметку или данные в `advanced-barista`.
- Онлайн-запись: `advanced-barista/tilda-blocks/09-online-booking-popup.html`
  подключает hosted `course-booking-widget.js` только после клика пользователя;
  ни токенов, ни прямых URL yClients в нём нет.
