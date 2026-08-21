# Курс «Латте-арт» — локальный preview

Локальная версия новой страницы `/latte-art`. Она нужна для визуальных правок
и не создаёт записей: в `preview.js` нет запросов к yClients, оплаты или
production URL.

## Запуск

Из папки `barista-course`:

```bash
python3 -m http.server 3216
```

Открыть: `http://localhost:3216/latte-art/`.

## Файлы

- `index.html` — структура и тексты local preview;
- `styles.css` — визуальный стиль и mobile-версия;
- `preview.js` — безопасная демонстрация окна записи и переключатель программы;
- `scripts/build-tilda-blocks.js` — генератор Tilda-блоков;
- `tilda-blocks/` — готовые файлы для ручной вставки в Tilda.

После изменения preview пересобрать Tilda-блоки:

```bash
node scripts/build-tilda-blocks.js
```

Реальная запись включается только отдельным release-пакетом в
`schedule-online/basic-barista-booking`. Production popup использует общий
виджет с course slug `latte-art`; он не содержит токенов и прямых URL yClients.
