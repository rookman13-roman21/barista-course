# Отдельные блоки для Tilda

## Порядок размещения

1. В head страницы вставить `00-seo.html` и задать Title страницы:
   `Курс «Альтернативное заваривание кофе» в Москве — 6 часов практики | MBS`.
2. Первым HTML-блоком страницы вставить `01-hero-and-for-whom.html`.
3. Сразу после него добавить отдельный HTML-блок со штатным
   `../../tilda_blocks_others/trainers-widget/tilda-block.html`.
4. Следующим HTML-блоком вставить `02-course-content.html`.
5. После CTA вставить один раз `09-online-booking-popup.html`.
6. Последним HTML-блоком вставить `10-page-interactions.html`.

`01-hero-and-for-whom.html`, `02-course-content.html` и
`10-page-interactions.html` сгенерированы из local preview. Если меняется
`index.html`, `styles.css` или безопасная часть `preview.js`, заново выполнить
из `alternative-brewing/`:

```bash
node scripts/build-tilda-blocks.js
```

`09-online-booking-popup.html` — отдельная production-обвязка. Она передаёт
только slug `alternative-brewing` общему виджету `course-booking-widget.js`: не
добавлять в этот файл токены, yClients URL или логику создания записи.

Блок тренеров не копируется в `alternative-brewing`: это самостоятельный
production-компонент с актуальными данными из публичного
`https://api.barista-school.ru/api/trainers.json`.

Ни этот порядок, ни наличие файлов не означают публикацию. Перед Tilda и
deploy `schedule-online` нужен финальный C-review и отдельное решение Романа.
