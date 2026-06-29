# Tilda-блоки страницы `[slug]`

Вставлять в Tilda отдельными HTML-блоками строго в таком порядке:

| Порядок | Файл | Назначение |
|---|---|---|
| 00 | `00-seo-and-page-styles.html` | Preconnect, static JSON-LD, общий CSS страницы |
| 01 | `01-top-content.html` | Hero и верхние смысловые секции |
| 02 | `02-schedule-widget-styles.html` | CSS расписания, покупки или виджета записи |
| 03 | `03-schedule-widget-script.html` | JS расписания/API/fallback или логика виджета |
| 04 | `04-bottom-content.html` | Нижние секции, FAQ, финальный CTA, контакты |
| 05 | `05-page-scripts.html` | Meta/canonical, FAQ, smooth scroll, font guard |

## Перед вставкой

- Проверить, что каждый блок не превышает лимит Tilda по объёму текста.
- Проверить, что `#consalt`, `#waiting_list`, `#order:...` не совпадают с видимыми `id`.
- Если страница использует yClients, сверить правила с `YCLIENTS_SYNC.md`.
- Если страница использует Tilda Shop, не добавлять JS-запись вместо `#order:...`.

## После вставки

- Проверить desktop и mobile 390px.
- Проверить шрифт Mulish.
- Проверить CTA, FAQ, popup/modal, расписание или покупку.
- Не публиковать без отдельного запроса.
