# Tilda-блоки страницы `/coffee_accounting_webinar`

Tilda pageid: `148220666`, projectid: `1009188`.

Вставлять в Tilda отдельными HTML-блоками строго в таком порядке:

| Порядок | Файл | Назначение |
|---|---|---|
| 00 | `00-seo-and-page-styles.html` | Preconnect, static JSON-LD, общий CSS страницы |
| 01 | `01-top-content.html` | Hero, для кого, программа, эксперт |
| 02 | `02-schedule-widget-styles.html` | CSS и HTML блока записи |
| 03 | `03-schedule-widget-script.html` | Обновление даты/ссылки из публичного JSON и fallback на `#waiting_list` |
| 04 | `04-bottom-content.html` | Результаты, бонус, FAQ, финальный CTA |
| 05 | `05-page-scripts.html` | Meta/canonical, smooth scroll, font guard |

## Перед вставкой

- Проверить mobile 390px в `index.html`.
- Проверить, что `#consalt` и `#waiting_list` не совпадают с видимыми `id`.
- Проверить публичный JSON синхронизации: основной `https://api.barista-school.ru/api/coffee-accounting-webinar.json`, fallback `https://159-194-202-120.sslip.io/api/coffee-accounting-webinar.json`.
- Если JSON ещё не опубликован, страница использует статическую fallback-ссылку записи.
- Не использовать Tilda API и не публиковать без отдельного запроса.

## После вставки

- Проверить шрифт Mulish.
- Проверить CTA до и после даты вебинара.
- Проверить, что дата на странице обновляется из JSON после изменения activity `44746455`.
- Проверить, что дата и кнопки записи не мигают старым значением: до загрузки JSON они скрыты, после синхронизации `body` получает класс `mbs-caw-sync-ready`.
- Проверить FAQ, контакты и открытие Tilda-попапов.
- После правок обновлять в Tilda только изменённые блоки, сохраняя порядок `00 → 05`.
