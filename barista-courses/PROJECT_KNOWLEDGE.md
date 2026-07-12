# Barista Courses: база знаний для Codex

Проект: новая HTML-версия страницы базового курса бариста для Tilda.

Публичная страница: `https://baristaschool.ru/barista_courses`

Локальная папка:
`/Users/Romka/Downloads/All_Code/barista-course/barista-courses`

Статус на 2026-06-24: страница работает через Tilda loader и hosted HTML на сервере; popup онлайн-записи обновлён, блок тренеров в hosted-странице исправлен и задеплоен на основной API-домен без нерабочего `sslip.io` fallback.

## Главные файлы

- `index.html` — локальная цельная версия страницы для проверки внешнего вида и логики.
- `tilda-source.html` — старый исходный HTML, скачанный из Tilda. Использовать только как архивный снимок.
- `PROJECT_STATE.md` — первичная заметка по проекту.
- `PROJECT_KNOWLEDGE.md` — актуальная база знаний для дальнейшей работы.
- `tilda-blocks/` — финальные HTML-блоки для вставки в Tilda.

## Tilda-блоки

Текущий порядок:

1. `00-seo.html` — SEO/head-блок для настроек страницы Tilda.
2. `01-hero.html` — первый экран, цены, CTA.
3. `02-who-for.html` — кому подходит курс.
4. `03-results.html` — что участник сможет после курса.
5. `04-program.html` — программа курса.
6. `05-format-price.html` — формат, стоимость, предоплата.
7. `06-equipment.html` — оборудование + компактная галерея с фотоальбомом.
8. `../tilda_blocks_others/trainers-widget/tilda-block.html` — общий loader-блок тренеров, встроен в hosted-сборку сразу после блока `03-results.html` / «Результат».
9. `07-faq.html` — FAQ с плавной гармошкой и single-open логикой.
10. `08-final-cta.html` — финальный CTA с контактами и inline SVG-иконками.
11. `09-online-booking-popup.html` — popup онлайн-записи, вставляется один раз после CTA-блоков.

## Hosted loader для Tilda

Для страницы `/barista_courses` подготовлена архитектура одного Tilda HTML-блока:

- `tilda-loader.html` — короткий loader, который один раз вставляется в Tilda.
- `hosted/barista-courses-page.html` — полный HTML страницы для выкладки на сервер.
- `build-barista-courses.js` — сборка hosted HTML из рабочих блоков `01`–`09` и общего loader-блока тренеров.

После перехода страницы на loader обычные правки делать в `tilda-blocks/`, затем запускать:

```bash
node barista-courses/build-barista-courses.js
```

После сборки выложить файл:

```text
barista-courses/hosted/barista-courses-page.html
```

на сервер как:

```text
/var/www/html/api/barista-courses-page.html
```

Важно: `git commit` и `git push` сохраняют исходники на GitHub, но сами по себе не обновляют live-страницу. После изменений в блоках `/barista_courses` обязательно отдельно выкладывать свежий `hosted/barista-courses-page.html` на сервер, иначе Tilda продолжит подтягивать старую hosted-версию.

Публичный URL hosted HTML:

```text
https://api.barista-school.ru/api/barista-courses-page.html
```

Текущий loader использует только основной hosted URL:

```text
https://api.barista-school.ru/api/barista-courses-page.html
```

Не добавлять обратно fallback `https://159-194-202-120.sslip.io/api-fallback/api/barista-courses-page.html` без отдельной проверки HTTPS: 2026-06-24 этот fallback был причиной риска падения загрузки.

В Tilda после перехода оставлять только loader-блок, системные блоки Tilda и форму `#consalt`, если она нужна на странице. Старые большие HTML-блоки `01`–`09` вместе с loader не публиковать, иначе контент продублируется.

Блок тренеров не копировать внутрь `barista-courses/tilda-blocks/`: сборка берёт общий источник `tilda_blocks_others/trainers-widget/tilda-block.html`. Сам виджет тренеров обновляется отдельно через `tilda_blocks_others/trainers-widget/` и публичные endpoints `https://api.barista-school.ru/api/trainers-widget.html` / `https://api.barista-school.ru/api/trainers.json`.

Важно по блоку тренеров:

- `data-widget-url` должен быть только `https://api.barista-school.ru/api/trainers-widget.html`;
- loader-скрипт должен грузить только `https://api.barista-school.ru/trainers-widget.js`;
- не использовать `https://159-194-202-120.sslip.io/api-fallback/api/trainers-widget.html`, потому что 2026-06-24 он не отвечал по HTTPS и ломал загрузку блока на `/barista_courses`.

Последний деплой hosted HTML:

- дата: 2026-06-24;
- файл: `barista-courses/hosted/barista-courses-page.html`;
- серверный путь: `/var/www/html/api/barista-courses-page.html`;
- backup перед деплоем: `/var/www/html/api/barista-courses-page.html.bak-20260624-173218`;
- live-проверка после деплоя: hosted HTML отдаёт `HTTP/2 200`, внутри блока тренеров стоит основной `api.barista-school.ru`, `trainers.json` валиден и содержит `trainers: 5`.

## Курс и цены

- Курс: `Базовый курс бариста`.
- Формат: `3 занятия по 3 часа`, всего `9 часов`.
- Один участник: `22 000 ₽`.
- Два участника: `30 000 ₽`.
- Предоплата: `5 000 ₽`.
- Остаток:
  - один участник: `17 000 ₽`;
  - два участника: `25 000 ₽`.
- Остаток оплачивается на первом занятии.

## Временная акция для школьников и студентов

С 2026-06-23 до 2026-08-31 на странице `/barista_courses` размещена акция: скидка `10%` для школьников и студентов.

Правила акции:

- Информация показывается только на странице базового курса.
- В промо-блоках рядом с текстом акции есть маленькая SVG-иконка условий.
- По клику на иконку открывается подсказка с условиями: промокод `СТУДЕНТ10`, подтверждение статуса, действие только на индивидуальные курсы бариста.
- Для применения скидки клиент должен назвать промокод `СТУДЕНТ10` при записи.
- Конкретные цены со скидкой не выводятся на странице.
- Онлайн-предоплата остаётся `5 000 ₽`.
- yClients, backend онлайн-записи, API, webhook-и и логика оплаты не меняются.
- Статус школьника или студента подтверждается вручную менеджером.
- Итоговую стоимость менеджер пересчитывает вручную после подтверждения статуса.
- Скидка не применяется задним числом после оплаты или согласования стоимости.

## Онлайн-запись

Кнопка `Онлайн запись` не заменяет кнопку `Оставить заявку`. На странице должны быть обе механики:

- `Оставить заявку` → `#consalt`.
- `Онлайн запись` → popup с виджетом.

Класс для открытия popup:

```html
mbs-bc-online-open
```

Popup-блок:

```html
tilda-blocks/09-online-booking-popup.html
```

Важно: для страницы `https://baristaschool.ru/barista_courses` онлайн-запись встроена именно через этот проектный popup-блок. Не вставлять сюда standalone snippet из проекта `schedule-online/basic-barista-booking/tilda/tilda-snippet.html`: он не содержит обработчики `.mbs-bc-online-open` и ломает открытие popup на странице.

При каждом открытии popup онлайн-записи виджет принудительно начинает с шага выбора формата:

- `Один участник`;
- `Два участника`.

Это сделано намеренно: старый draft в `localStorage` может помнить предыдущий шаг, но при новом клике по `Онлайн запись` клиент должен сначала выбрать формат обучения. При этом контактные данные из draft сохраняются, а ранее выбранные формат, тренер, даты и занятия сбрасываются.

Виджет подключается из:

```text
https://api.barista-school.ru/basic-barista-widget.js?v=basic-barista-variants-20260611-stable
```

Если основной API-домен недоступен, popup пробует fallback JS:

```text
https://159-194-202-120.sslip.io/api-fallback/basic-barista-widget.js?v=basic-barista-variants-20260611-stable
```

Slots JSON:

```text
https://api.barista-school.ru/api/basic-barista-slots.json
```

Fallback slots JSON:

```text
https://159-194-202-120.sslip.io/api-fallback/api/basic-barista-slots.json
```

Backend записи:

```text
https://api.barista-school.ru/api/barista-booking
```

Актуальная production-логика на 2026-06-15: базовый курс создаётся в yClients через manager-flow с `manager_seance_length = 12600` и `manager_technical_break_duration = 1800`. Это даёт 3 часа услуги и 30 минут технического перерыва. Тестовая запись после изменения подтвердила корректную длительность; тестовую запись на `+79035064620` отдельно не меняли.

Проверено перед публикацией:

- widget URL отвечает `200 application/javascript`;
- slots URL отвечает `200 application/json`;
- slots JSON содержит варианты `solo` и `pair`;
- backend на пустой POST возвращает ожидаемую validation error.

## Контакты

Использовать только актуальные контакты:

- Телефон: `+7 995 999 2836`, ссылка `tel:+79959992836`.
- Telegram: `https://t.me/Moscow_barista_school`.
- WhatsApp: `https://wa.me/message/42GZ6YYBJTM5B1`.

Контакты добавлены в финальный CTA.

## Важные UI-решения

### Tilda-safe sticky

В блоках `03-results.html` и `07-faq.html` левая колонка двигается при скролле на desktop.

Не используется `position: sticky`, потому что внутри Tilda он может ломаться. Вместо этого используется JS-сдвиг через `transform: translate3d(...)`.

На мобильной версии механика отключается.

### FAQ

FAQ сделан через `details`, но открытие/закрытие анимируется JS через высоту.

Правило: одновременно открыт только один вопрос. При открытии нового остальные закрываются.

### Equipment + gallery

Блок оборудования и галерея объединены в один блок `06-equipment.html`.

Фото компактные:

- desktop: 6 фото в одну строку;
- tablet: 3 колонки;
- mobile: 2 колонки.

При клике фото открываются в fullscreen-фотоальбом:

- закрытие по крестику;
- закрытие по клику на фон;
- закрытие по `Escape`;
- переключение стрелками на экране;
- переключение клавишами `ArrowLeft` / `ArrowRight`.

### Final CTA

Финальный CTA приведён к стилю `barista-3/tilda-blocks/07-cta.html`.

Особенности:

- светло-зелёная карточка `#E7F2E3`;
- две колонки на desktop;
- крупная красная кнопка онлайн-записи;
- белая secondary-кнопка заявки;
- контакты под кнопками;
- inline SVG-иконки для кнопок и контактов.

## Безопасность

Перед публикацией проверено:

- API-ключей нет;
- токенов нет;
- паролей нет;
- `.env` нет;
- SSH/server access нет;
- `localhost`, `127.0.0.1`, `file://` нет;
- `TODO` / `FIXME` нет;
- service id `14516899` в блоках не найден.

В HTML-блоках есть только публичные URL:

- Tilda CDN images;
- public widget URL;
- public slots JSON;
- public booking endpoint;
- Telegram/WhatsApp/tel links.

## Проверки перед публикацией

Последняя проверка перед публикацией:

- JS-синтаксис всех `<script>`: OK.
- JSON-LD в `00-seo.html`: OK.
- Секреты и локальные URL: не найдены.
- Порядок файлов: `00`–`09`.
- Popup онлайн-записи связан с классом `.mbs-bc-online-open`.
- Popup онлайн-записи должен оставаться в `09-online-booking-popup.html`; standalone snippet `tilda-snippet.html` из `schedule-online` на эту страницу не вставлять.
- Hosted HTML должен содержать `data-widget-url="https://api.barista-school.ru/api/trainers-widget.html"` для блока тренеров.
- `tilda-loader.html` должен грузить `https://api.barista-school.ru/api/barista-courses-page.html` без `sslip.io` fallback.
- `#mbs-bc-program` существует и соответствует ссылке из hero.

## Что не трогать без необходимости

- Не удалять кнопку `Оставить заявку`: она нужна как fallback для клиентов, не готовых записаться онлайн.
- Не заменять `#consalt`: это рабочий якорь Tilda для формы заявки.
- Не удалять `09-online-booking-popup.html`: без него кнопки онлайн-записи не откроют виджет.
- Не заменять проектный popup на `schedule-online/basic-barista-booking/tilda/tilda-snippet.html`: этот snippet предназначен для самостоятельной вставки виджета, а не для страницы с интегрированным popup.
- Не возвращать fallback `159-194-202-120.sslip.io` в loader страницы или loader блока тренеров без новой live-проверки.
- Не переносить секреты или YClients-токены в frontend/Tilda-блоки.
- Не использовать старую WhatsApp-ссылку `https://wa.me/79959992836`; актуальная ссылка указана выше.

## Связанные проекты

Онлайн-запись и backend живут отдельно:

`/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking`

Дизайн-система:

`/Users/Romka/Downloads/All_Code/mbs-design-system/DESIGN_SYSTEM.md`

Правило финального CTA и контактов уже добавлено в дизайн-систему.
