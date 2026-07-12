# Tilda-блоки страницы `/master_doma`

Вставлять в Tilda отдельными HTML-блоками строго в таком порядке:

| Порядок | Файл | Назначение |
|---|---|---|
| 00 | `00-seo-and-page-styles.html` | Preconnect, static JSON-LD, общий CSS страницы |
| 01 | `01-top-content.html` | Hero, смысловые секции, программа, контейнер расписания |
| 02 | `02-schedule-widget-styles.html` | CSS существующего виджета `homebrew-schedule-sync` |
| 03 | `03-schedule-widget-script.html` | JS существующего виджета `homebrew-schedule-sync` |
| 04 | `04-bottom-content.html` | Тренеры, горизонтальная галерея, FAQ, финальный CTA |
| 05 | `05-page-scripts.html` | Meta/canonical, smooth scroll, font guard, hosted loaders, renderer галереи |

## Перед вставкой

- Проверить, что каждый блок не превышает лимит Tilda по объёму текста.
- Проверить, что `#consalt`, `#waiting_list` не совпадают с видимыми `id`.
- Расписание не переписывать: оно берётся из `https://api.barista-school.ru/api/homebrew.json`.
- Расписание вставлено без внешней декоративной карточки: не возвращать `.mbs-master-doma-page__schedule-shell`.
- Блок тренеров вставлен без внешней декоративной карточки вокруг hosted-виджета.
- Галерея берётся из `https://api.barista-school.ru/api/homebrew-gallery.json`; карточки должны оставаться горизонтальным слайдером на desktop и mobile.
- Backend, cron, Google Sheets и `.env` не менять.

## Важное по галерее

- Не делать вокруг галереи отдельную белую рамку или градиенты по краям.
- Карточки фотоальбомов должны идти в один ряд и листаться влево/вправо.
- Карточка фотоальбома рендерится как `article role="button" tabindex="0"`, а не как `<button>` с `div/h3/p` внутри; это нужно для стабильного отображения в Safari.
- Верхнее фото карточки заполняет `.mbs-master-doma-page__gallery-img-wrap` через `position:absolute`, `inset:0`, `object-fit:cover`.
- Google Drive/LH3 URL нормализуются в `05-page-scripts.html`: `=s800` для обложек, `=s1600` для попапа.
- По клику, Enter или Space открывается попап с фотоальбомом, стрелками, счётчиком и миниатюрами.

## После вставки

- Проверить desktop и mobile 390px.
- Проверить шрифт Mulish.
- Проверить CTA, FAQ, расписание, блок тренеров и галерею.
- Проверить, что кнопки записи открывают запись.
- Проверить, что в галерее верхняя фотография каждой карточки начинается от верхней границы карточки без пустой полосы.
- Не публиковать без отдельного запроса.
