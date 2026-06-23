# Barista Courses: база знаний для Codex

Проект: новая HTML-версия страницы базового курса бариста для Tilda.

Публичная страница: `https://baristaschool.ru/barista_courses`

Локальная папка:
`/Users/romansuslin_1/Downloads/All_Code/barista-course/barista-courses`

Статус на 2026-05-26: блоки подготовлены, проверены и опубликованы в Tilda.

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
8. `07-faq.html` — FAQ с плавной гармошкой и single-open логикой.
9. `08-final-cta.html` — финальный CTA с контактами и inline SVG-иконками.
10. `09-online-booking-popup.html` — popup онлайн-записи, вставляется один раз после CTA-блоков.

## Hosted loader для Tilda

Для страницы `/barista_courses` подготовлена архитектура одного Tilda HTML-блока:

- `tilda-loader.html` — короткий loader, который один раз вставляется в Tilda.
- `hosted/barista-courses-page.html` — полный HTML страницы для выкладки на сервер.
- `build-barista-courses.js` — сборка hosted HTML из рабочих блоков `01`–`09`.

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

Публичный URL hosted HTML:

```text
https://api.barista-school.ru/api/barista-courses-page.html
```

Fallback URL для loader:

```text
https://159-194-202-120.sslip.io/api-fallback/api/barista-courses-page.html
```

В Tilda после перехода оставлять только loader-блок, системные блоки Tilda и форму `#consalt`, если она нужна на странице. Старые большие HTML-блоки `01`–`09` вместе с loader не публиковать, иначе контент продублируется.

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

С 2026-06-23 до 2026-08-31 на странице `/barista_courses` размещена текстовая акция: скидка `10%` для школьников и студентов.

Правила акции:

- Информация показывается только на странице базового курса.
- Конкретные цены со скидкой не выводятся на странице.
- Онлайн-предоплата остаётся `5 000 ₽`.
- yClients, backend онлайн-записи, API, webhook-и и логика оплаты не меняются.
- Статус школьника или студента подтверждается вручную менеджером.
- Итоговую стоимость менеджер пересчитывает вручную после подтверждения статуса.

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

Виджет подключается из:

```text
https://api.barista-school.ru/basic-barista-widget.js?v=basic-barista-variants-20260526
```

Slots JSON:

```text
https://api.barista-school.ru/api/basic-barista-slots.json
```

Backend записи:

```text
https://api.barista-school.ru/api/barista-booking
```

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
- `#mbs-bc-program` существует и соответствует ссылке из hero.

## Что не трогать без необходимости

- Не удалять кнопку `Оставить заявку`: она нужна как fallback для клиентов, не готовых записаться онлайн.
- Не заменять `#consalt`: это рабочий якорь Tilda для формы заявки.
- Не удалять `09-online-booking-popup.html`: без него кнопки онлайн-записи не откроют виджет.
- Не переносить секреты или YClients-токены в frontend/Tilda-блоки.
- Не использовать старую WhatsApp-ссылку `https://wa.me/79959992836`; актуальная ссылка указана выше.

## Связанные проекты

Онлайн-запись и backend живут отдельно:

`/Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking`

Дизайн-система:

`/Users/romansuslin_1/Downloads/All_Code/mbs-design-system/DESIGN_SYSTEM.md`

Правило финального CTA и контактов уже добавлено в дизайн-систему.
