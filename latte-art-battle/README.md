# MBS* Latte-art x Petmol

База знаний по лендингу чемпионата по латте-арту Московской школы бариста.

Актуально на `2026-06-08`.

Страница на сайте:

```text
https://baristaschool.ru/latte_art_battle
```

Событие:

- Название на лендинге: `MBS* Latte-art x Петмол`
- Формат: чемпионат по латте-арту
- Дата: `2026-07-02`
- Время: `10:00`
- Вступительный взнос: `3000 ₽`
- Количество участников: берется из group activity yClients, fallback `30`
- Адрес: `Новодмитровская ул., 2, корп. 1, Москва`
- Площадка: партнёрская площадка проекта `CafeStore`
- Основной партнёр в названии: `Петмол`

## Архитектура

Страница работает через hosted loader:

1. В Tilda вставлен короткий HTML из `tilda-loader.html`.
2. Loader загружает полный HTML/CSS/JS с API-домена.
3. Основной код страницы живет в `latte-art-battle.html`.
4. Запись из popup идет в backend booking-сервиса.
5. Публичные данные для участников, счетчиков, судей и партнёров берутся из JSON.

Это сделано, чтобы не редактировать большой HTML внутри Tilda каждый раз.

Если hosted HTML не загрузился за `10` секунд, loader не должен висеть бесконечно: он показывает fallback-блок с кнопкой `Написать в Telegram` на `https://t.me/Moscow_barista_school` и кнопкой обновления страницы.

## Файлы проекта

В этом каталоге:

- `latte-art-battle.html` — полный hosted HTML/CSS/JS лендинга и popup записи.
- `telegram-mini-app.html` — закрытая Telegram Mini App памятка для чата участников.
- `tilda-loader.html` — короткий loader для HTML-блока Tilda с timeout и Telegram fallback.
- `README.md` — эта база знаний.

Связанные файлы backend:

```text
/Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/courses/latte-art-battle.json
/Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/server/basic-barista-booking-server.js
/Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_latte_art_battle.js
/Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_latte_art_battle.test.js
/Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_slots.py
```

## Публичные URL

```text
https://api.barista-school.ru/api/latte-art-battle.html
https://api.barista-school.ru/api/latte-art-battle-mini-app.html
https://api.barista-school.ru/api/latte-art-battle-data.json
https://api.barista-school.ru/api/courses/latte-art-battle/slots.json
https://api.barista-school.ru/api/course-booking/latte-art-battle
https://api.barista-school.ru/api/course-booking/latte-art-battle/telegram-mini-app-data
```

Loader в Tilda сейчас грузит:

```text
https://api.barista-school.ru/api/latte-art-battle.html?v=20260530-1
```

Если нужно сбросить кеш Tilda/браузера, можно поменять query version в `tilda-loader.html`.

Текущий loader:

- ждёт загрузку hosted HTML до `10` секунд;
- до загрузки hosted HTML показывает статический SEO-блок с `h1`, описанием, датой, ценой и адресом события;
- содержит `noscript` fallback с тем же основным SEO-текстом и ссылкой на Telegram;
- при успешной загрузке вставляет HTML в `#mbs-latte-battle-hosted-root` и запускает вложенные scripts;
- при ошибке загрузки показывает компактный fallback с Telegram школы и кнопкой `Обновить страницу`.

## Tilda

Текущая страница Tilda:

```text
projectid=1009188
pageid=43593725
URL: https://baristaschool.ru/latte_art_battle
```

В Tilda должен быть HTML-блок с содержимым `tilda-loader.html`.

На странице не должно быть старых больших Tilda-блоков лендинга чемпионата. После перехода на hosted HTML основной лендинг держится только в `latte-art-battle.html`; старые секции Tilda нужно удалять или не публиковать, иначе страница становится тяжёлой и может грузиться нестабильно.

Если используется лист ожидания, в Tilda можно оставить отдельный popup `#waiting_list`, но не возвращать старый лендинг целиком.

Важно:

- URL страницы не менять.
- Новую страницу не создавать, если можно обновлять эту.
- Весь большой код держать в hosted HTML.
- В клиентских текстах не упоминать yClients и внутреннюю механику записи.

Важно после изменения `tilda-loader.html`: обновить HTML-блок в Tilda и опубликовать страницу. Локальный loader от `2026-06-08` уже содержит статический SEO-блок, но live-исходник Tilda начнет отдавать его только после публикации страницы в Tilda.

## Сервер

Hosted HTML лежит на сервере:

```text
/var/www/html/api/latte-art-battle.html
/var/www/html/api/latte-art-battle-mini-app.html
```

Публичный JSON:

```text
/var/www/html/api/latte-art-battle-data.json
```

Slots JSON:

```text
/var/www/html/api/courses/latte-art-battle/slots.json
```

Backend booking-сервиса:

```text
/opt/basic-barista-booking/
```

PM2 process:

```text
basic-barista-booking
```

Nginx на `api.barista-school.ru` отдает точечные locations для:

- `/api/latte-art-battle.html`
- `/api/latte-art-battle-mini-app.html`
- `/api/latte-art-battle-data.json`
- `/api/courses/latte-art-battle/slots.json`
- `/api/course-booking/latte-art-battle` проксируется в booking-сервис

SEO-настройка API-дубля:

```nginx
location /api/latte-art-battle.html {
    alias /var/www/html/api/latte-art-battle.html;
    default_type text/html;
    charset utf-8;
    add_header Access-Control-Allow-Origin "*" always;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    add_header X-Robots-Tag "noindex, follow" always;
}
```

Это нужно, чтобы hosted HTML на `api.barista-school.ru` не индексировался как дубль основной страницы `https://baristaschool.ru/latte_art_battle`.

Перед изменением nginx от `2026-06-08` backup сохранён на сервере:

```text
/root/barista-api.bak-20260608-latte-seo-2
```

Проверка:

```bash
curl -sI https://api.barista-school.ru/api/latte-art-battle.html
```

В ответе должен быть заголовок:

```text
X-Robots-Tag: noindex, follow
```

На основной странице `https://baristaschool.ru/latte_art_battle` такого заголовка быть не должно.

## SEO И Индексация

Основной индексируемый URL:

```text
https://baristaschool.ru/latte_art_battle
```

Canonical в Tilda указывает на этот URL. Страница есть в `https://baristaschool.ru/sitemap.xml`, `robots.txt` её не закрывает.

SEO-правки от `2026-06-08`:

- hosted HTML закрыт от индексации на API-домене через `X-Robots-Tag: noindex, follow`;
- в `latte-art-battle.html` добавлена JSON-LD разметка `Event` для чемпионата;
- при загрузке hosted HTML на основной странице runtime удаляет старую неправильную Tilda JSON-LD разметку `Product / Продвинутый курс` и добавляет корректную `Event`-разметку в `head`;
- основной `h1` усилен до `MBS* Latte-art x Петмол — чемпионат по латте-арту`;
- `tilda-loader.html` дополнен статическим SEO-блоком и `noscript` fallback.

JSON-LD событие должно содержать:

```text
@type: Event
name: MBS* Latte-art x Петмол — чемпионат по латте-арту
startDate: 2026-07-02T10:00:00+03:00
endDate: 2026-07-02T13:00:00+03:00
location: CafeStore, Новодмитровская ул., 2, корп. 1, Москва
offers.price: 3000
offers.priceCurrency: RUB
organizer: Московская школа бариста
```

Проверка hosted HTML:

```bash
curl -sS https://api.barista-school.ru/api/latte-art-battle.html \
  | grep -n -E '@type": "Event"|data-mbs-latte-battle-event-schema|<h1>MBS\* Latte-art x Петмол'
```

Проверка основной страницы:

```bash
curl -sI https://baristaschool.ru/latte_art_battle
```

В ответе основной страницы не должно быть `X-Robots-Tag: noindex`.

Остаточный ручной шаг: обновить HTML-блок Tilda содержимым текущего `tilda-loader.html` и опубликовать страницу, чтобы статический SEO fallback был в исходном HTML Tilda до выполнения JavaScript.

## Telegram Mini App

Для чата участников есть закрытая Mini App памятка:

```text
https://api.barista-school.ru/api/latte-art-battle-mini-app.html
```

Запуск — через закреплённое сообщение в Telegram-чате участников. Так как BotFather уже включил Main Mini App для `MBS_work_bot`, кнопка в закрепе ведёт на direct `startapp` ссылку:

```text
https://t.me/MBS_work_bot?startapp=latte_art_battle_info
```

Этот формат должен открывать Mini App прямо из текущего Telegram-чата. Старый путь через личный `/start latte_art_battle_info` оставлен только как fallback.

Mini App показывает:

- главное: дата, площадка, лимит участников и актуальные счётчики подтверждённых мест;
- на главном экране: основную информацию по участию — молоко `Петмол Barista`, чашки `mowe` серии `ТЕТТА 300H`, карточки рисунков и систему балльной оценки;
- регламент и ссылку на PDF-export Google Docs;
- публичный список участников;
- судей с попапом по центру экрана: фото, роль и полное описание из публичного JSON;
- призы;
- FAQ, включая первый пункт про ограничение опыта работы бариста до 3 лет включительно и ссылку `Открыть карту` в вопросе `Где проходит чемпионат?`.

На главном экране Mini App не показывать взнос и карточку `Всего мест`: участник уже оплатил участие, а лимит указан в компактной карточке `Участники`.

В блоке `На чём выступаем` используются статичные SVG:

```text
Молоко Петмол Barista:
https://static.tildacdn.com/tild3138-3663-4933-a539-376330613661/1.svg

Чашки mowe, серия ТЕТТА 300H:
https://static.tildacdn.com/tild3633-3666-4432-b665-636534613936/2.svg

Карточки рисунков:
https://static.tildacdn.com/tild6630-6365-4666-b830-393266633262/3.svg
```

В FAQ первый пункт должен оставаться статичным и предупреждать, что чемпионат создан для бариста с опытом работы до 3 лет включительно; при превышении ограничения участника не допускают без возврата взноса, а если несоответствие выявлено после чемпионата, результат аннулируется.

Ссылка на карту площадки:

```text
https://yandex.ru/maps/-/CPTXJM8V
```

Доступ закрыт на backend:

- frontend отправляет только `Telegram.WebApp.initData`;
- backend валидирует подпись `initData` по токену бота;
- backend проверяет членство пользователя в чате через `getChatMember`;
- если пользователь не из чата, Mini App показывает экран `Откройте приложение из чата участников`.

Webhook бота:

```text
POST /api/course-booking/latte-art-battle/telegram-bot-webhook
```

Webhook защищён заголовком `X-Telegram-Bot-Api-Secret-Token`; секрет не хранить в HTML, README и git.

Токен бота не хранить в HTML, README, git и публичных логах. В Mini App не выводить телефоны, email, ссылки оплаты, внутренние `record_id` и Telegram участников.

## Дизайн

Основной стиль:

- шрифт: `Mulish`
- фирменные цвета:
  - зеленый: `#417033`, `#4F883E`, `#B6D8AB`, `#E7F2E3`
  - красный: `#CC2841`, `#D83D54`, `#F8DDE1`
  - нейтральные: `#1F1F1F`, `#555555`, `#F5F5F5`, `#FFFFFF`

Hero использует изображение:

```text
https://static.tildacdn.com/tild3663-3166-4466-b838-653837656565/2E72508D-2927-4E8B-B.png
```

Все классы лендинга изолированы префиксом:

```text
mbs-latte-battle-
```

Popup тоже находится внутри этого namespace.

## Блоки лендинга

В `latte-art-battle.html` реализованы:

- hero
- описание события
- как проходит чемпионат
- компактный блок организационных условий для участника
- регламент чемпионата после механики
- таблица участников
- счетчики зарегистрированных участников и свободных мест
- судьи из Google Sheets
- призы чемпионата в стиле карточек мест `2 / 1 / 3`
- партнёры чемпионата из Google Sheets
- FAQ
- финальный CTA
- скрытая техническая заготовка под будущую фотогалерею

Блоки призов и партнёров уже заполнены фактическими данными. Не возвращать их к заглушкам без отдельного решения.

Финальный CTA приведён к стандарту `mbs-design-system`: светло-зелёная карточка, основная кнопка участия, вторичная кнопка `Оставить заявку` с `href="#consalt"` и контактный fallback с телефоном, Telegram и WhatsApp.

## Организационная информация на странице

На лендинге кратко вынесены основные условия для участника:

- чемпионат проходит на партнёрской площадке проекта `CafeStore` по адресу `Новодмитровская ул., 2, корп. 1, Москва`;
- участвовать может бариста от 18 лет с опытом работы не более 3 лет;
- правило про опыт до 3 лет сделано, чтобы начинающие бариста могли получить реальный опыт чемпионата в честной среде;
- максимум участников — 30 человек;
- на отборочном этапе выступление длится 4 минуты, дальше проходят 16 участников;
- полуфинал проходит в формате батла на вылет;
- в финале участнику даётся 6 минут, выполняется рисунок-задание по карточке организатора;
- кофе, молоко, кофемашина, кофемолка и чашки предоставляются партнёрами;
- участник может использовать свой питчер;
- место закрепляется только после оплаты вступительного взноса;
- до начала чемпионата место можно передать другому участнику по согласованию с организаторами, возврат взноса не предусмотрен.

Юридические формулировки про ответственность и фото-/видеосъёмку остаются в регламенте и не выносятся на лендинг.

## Popup Записи

CTA `Участвовать` открывает popup на странице.

Поля формы:

- `Фамилия *`
- `Имя *`
- `Телефон *` — отдельный выбор кода страны и национальный номер, как в общем booking-widget
- `Email *`
- `Telegram *`
- `Проект / место работы *`
- `Комментарий`
- обязательный чекбокс `Я подтверждаю, что мой опыт работы бариста не более 3 лет.` — первый среди чекбоксов
- обязательный чекбокс `С регламентом чемпионата ознакомлен(а)`
- согласие на обработку персональных данных
- обязательное согласие на информационно-рекламную рассылку

В popup есть автозаполнение через `localStorage`:

```text
mbs-latte-battle-booking-client-v1
```

Автозаполнение хранится не дольше 24 часов и очищается после успешного создания записи, перед показом кнопки оплаты. В `localStorage` не хранить ссылку оплаты и внутренние ID.

В правом верхнем углу popup есть иконка копирования ссылки на регистрацию. Кнопка копирует ссылку:

```text
https://baristaschool.ru/latte_art_battle#mbs-latte-battle-popup
```

При открытии страницы с hash `#mbs-latte-battle-popup` popup регистрации открывается автоматически, если места не распроданы.

Telegram нормализуется на frontend и backend:

- `username` -> `@username`
- `@username` -> `@username`
- `https://t.me/username` -> `@username`

После отправки формы backend создает запись в групповое событие и возвращает ссылку оплаты из созданной записи. На сайте клиент видит экран подтверждения и кнопку оплаты.

Клиентские тексты должны говорить простым языком:

- `мы забронируем место`
- `место закрепляется после оплаты взноса`

Видимые ссылки на регламент на лендинге называются просто `Регламент` / `Открыть регламент`, без слова `PDF`.
Ссылки на лендинге ведут на Google Docs preview, чтобы регламент открывался для чтения в новой вкладке без скачивания файла.

В Telegram Mini App кнопка во вкладке `Регламент` называется `Открыть PDF-регламент` и ведёт на Google Docs PDF export.

Не писать на странице:

- `yClients`
- `визит`
- внутренние ID
- технические статусы оплаты

## yClients

Техническая конфигурация события хранится в:

```text
schedule-online/basic-barista-booking/courses/latte-art-battle.json
```

Ключевые параметры:

- `slug`: `latte-art-battle`
- `record_create_mode`: `activity`
- `activity_id`: `44110911`
- `service_id`: `14800644`
- `staff_id`: `1322836`
- `activity_date`: `2026-07-02`
- `activity_time`: `10:00`
- `manager_seance_length`: `10800`
- `prepayment_amount`: `3000`
- `reservation_ttl_ms`: `900000`
- `require_telegram`: `true`
- `require_project_name`: `true`
- `require_experience_limit_consent`: `true`
- `require_rules_consent`: `true`
- `require_marketing_consent`: `true`
- `write_client_history_comment`: `true`
- `skip_calendar_sync`: `true`

Backend создает запись через manager API в group activity. После создания он проверяет, что запись действительно относится к:

```text
activity_id=44110911
```

Если yClients создаст обычную запись без нужного `activity_id`, backend пытается отменить такую запись и возвращает ошибку.

Явный `activity_id` остаётся основным источником для записи в событие. Если заданный ID стал недоступен или событие было пересоздано, backend и sync-скрипт умеют искать групповое событие через `/activity/{company_id}/search/` по дате `2026-07-02`, времени `10:00` и лимиту `30`. Это fallback на случай пересоздания события, но при подготовке нового чемпионата правильнее всё равно обновить `activity_id` в конфиге.

Боевые тестовые записи не создавать без отдельного решения, чтобы не добавлять тестового участника в событие.

## Дополнительные Поля Клиента

В карточке клиента yClients используются дополнительные поля:

| Поле формы | API key в yClients | Как пишется |
| --- | --- | --- |
| Telegram | `telegram` | основной рабочий формат `custom_fields: { "telegram": "@username" }` |
| Проект / место работы | `mesto-raboti` | основной рабочий формат `custom_fields: { "mesto-raboti": projectName }` |

Важно: yClients может принять `PUT /client/{company_id}/{client_id}` с нерабочим форматом `custom_fields` и при этом не сохранить значения в карточке клиента. Backend поэтому обновляет карточку клиента через несколько форматов:

1. прямые поля по API key;
2. `custom_fields` объектом;
3. `custom_fields` через `id`, если ID поля есть в текущей карточке клиента;
4. `custom_fields` массивом `{ code, value }`.

После каждой попытки backend заново читает карточку клиента и считает обновление успешным только если `telegram` и `mesto-raboti` реально появились в дополнительных полях. Если yClients принял запрос, но значения не сохранились, в лог пишется `activity_client_update_failed`.

Для group activity есть важный нюанс: сразу после `POST /records/{company_id}` у созданной записи `record.client.id` может ещё не быть доступен. Поэтому backend делает мгновенную попытку обновить карточку клиента, а если `client_id` ещё пустой — запускает короткие фоновые повторы через `1.5с`, `5с` и `15с`. Повтор на этапе подтверждения оплаты и финальный повтор после delayed `PUT /record` оставлены как страховка: yClients может очистить дополнительные поля клиента после служебного обновления записи. Данные для повторов хранятся в reservation state: имя, фамилия, телефон, email, Telegram, проект / место работы и согласия.

Поле `Проект / место работы` также добавляется в комментарий записи строкой:

```text
Проект / место работы: ...
```

Это fallback для уже созданных записей и для sync-скрипта, если custom field не вернулся в списке записей.

4 июня 2026 исправлена запись дополнительных полей в карточку клиента. До исправления yClients создавал запись и сохранял проект / место работы в комментарий записи, но не сохранял `telegram` и `mesto-raboti` в доп. поля клиента. Подтверждённый рабочий формат — объект `custom_fields`, затем добавлены быстрые повторы обновления карточки после создания записи, потому что `client_id` может появляться не сразу. После свежего кейса с пустыми полями добавлен ещё один повтор после delayed `PUT /record`, потому что служебное обновление записи может очистить дополнительные поля клиента. Исторический backfill на 4 июня: `mesto-raboti` заполнено у 14/14, `telegram` у 12/14; 2 Telegram не восстановлены из-за отсутствия значения в доступных комментариях yClients.

5 июня 2026 найден второй источник проблемы: после корректной записи `telegram` и `mesto-raboti` в карточку клиента интеграция Битрикс ↔ yClients могла затереть эти поля пустыми значениями из Битрикс. В `bitrix-tools/integrations/sync_client_fields.py` логика для Telegram и места работы переведена в режим fill-empty: пустое поле всегда заполняется из непустого, но пустое значение не затирает заполненное. Карточки Шелипов Ян и Карасева Алина восстановлены вручную и синхронизированы в Битрикс.

Факт подтверждения опыта сохраняется в комментарии записи строкой:

```text
Опыт работы бариста: не более 3 лет — подтверждено участником
```

После регистрации backend добавляет один короткий комментарий в историю комментариев клиента yClients через поле `Новый комментарий`. В комментарий попадают только событие, email, Telegram, проект / место работы, подтверждение опыта до 3 лет и источник. Свободное поле формы `Комментарий` должно попадать в поле карточки клиента `Примечание о клиенте`, а не в комментарий к записи. В комментарии к записи остаются только служебные строки регистрации, Telegram, проект / место работы и подтверждение опыта.

## Email-уведомления

Для новых регистраций backend `basic-barista-booking` отправляет два письма, если на production настроены `COURSE_BOOKING_SMTP_*`:

- сразу после создания брони — `Подтвердите участие в MBS Latte-art x Петмол`, ссылка оплаты и ссылка Telegram;
- после 15 минут без оплаты — `Бронь на чемпионат не подтвердилась`, ссылка повторной регистрации `https://baristaschool.ru/latte_art_battle#mbs-latte-battle-popup` и ссылка Telegram менеджера.

Письма отправляются через `server/booking-email.js`, а не через штатные письма yClients. Ошибка SMTP не ломает запись, оплату, автоотмену или публичный sync. В логах не должно быть email клиента и ссылки оплаты.

Production-статус на 4 июня 2026: SMTP для booking-сервиса включён в `/opt/basic-barista-booking/.env`, бэкап перед изменением — `/opt/basic-barista-booking/.env.bak.20260604183919`. После рестарта `basic-barista-booking` тестовые письма обоих типов (`payment` и `expired`) успешно отправлены на `baristaschool@ya.ru`; проверка `/health` после отправки вернула `ok`.

## Google Sheets

Участники:

```text
https://docs.google.com/spreadsheets/d/1YYz0MMQwHIeFPVAgU9wHtk6PI5zT0CzfBi5SKJlXloY/edit?gid=0#gid=0
```

Структура:

- `first_name`
- `last_name`
- `project_name`
- `source`
- `yclients_record_id`
- `status`
- `updated_at`

На сайте показываются только:

- имя
- фамилия
- проект / место работы

Судьи:

```text
https://docs.google.com/spreadsheets/d/1Ty7fdvmrJKRnDDOs_marDULQr_wDZQq2M9RwgS5EOWg/edit?usp=sharing
```

Вкладка:

```text
judges
```

Структура:

- `active`
- `sort_order`
- `name`
- `role`
- `description`
- `photo_url`
- `telegram_url`
- `instagram_url`

На сайте выводятся только активные судьи, отсортированные по `sort_order`.

Поведение блока на сайте:

- карточка судьи компактная: фото, имя, роль и короткое превью описания;
- полный текст открывается в popup-профиле по клику на карточку;
- popup судьи держит общий дизайн-код с `tilda_blocks_others/trainers-widget/trainers-widget.html`: зелёная рамка, фото слева, контент справа, badge, крупное имя, зелёная роль, pill-метрики и мягкие серые карточки;
- текст popup-профиля разбивается на блоки `Опыт`, `Управление и проекты`, `Чемпионаты и судейство`;
- если заполнено меньше 4 судей, сетка добирается карточками-заглушками `Ещё судьи скоро появятся`;
- длинные описания не должны растягивать карточку по высоте.

Партнёры:

```text
https://docs.google.com/spreadsheets/d/1Ty7fdvmrJKRnDDOs_marDULQr_wDZQq2M9RwgS5EOWg/edit?usp=sharing
```

Вкладка:

```text
partners
```

Структура вкладки:

- `active`
- `sort_order`
- `name`
- `role`
- `description`
- `logo_url`
- `website_url`

На текущей версии сайта партнёры читаются из Google Sheets через `update_latte_art_battle.js`, попадают в `latte-art-battle-data.json` и рендерятся frontend-блоком `Партнёры чемпионата`.

Особенности импорта партнёров:

- если `active` пустой, партнёр считается активным;
- строка попадает на сайт только если есть `logo_url`;
- `name` используется как alt/aria-label, если пустой — frontend показывает fallback `Партнёр чемпионата`;
- скрипт принимает не только строгие заголовки `name` и `logo_url`, но и распространённые русские варианты вроде `название`, `партнёр`, `лого`, `логотип`, `ссылка на лого`.

Особенности дизайна партнёров:

- блок вынесен в отдельную белую секцию;
- композиция повторяет блок партнёров на `https://baristaschool.ru/mbs_mixology_cup`;
- на desktop используется сетка 6 логотипов в строку;
- неполная последняя строка центрируется;
- для текущих логотипов есть точечные CSS-классы, чтобы визуально подтянуть маленькие логотипы и ограничить слишком крупные.

Сервисный аккаунт:

```text
barista-bot@beget-schoolbarista.iam.gserviceaccount.com
```

## Публичный JSON

Файл:

```text
https://api.barista-school.ru/api/latte-art-battle-data.json
```

Генерируется скриптом:

```text
schedule-online/basic-barista-booking/scripts/update_latte_art_battle.js
```

Источники:

- yClients group activity `44110911` для лимита мест
- yClients records по `activity_id=44110911`
- Google Sheets участников
- Google Sheets судей
- Google Sheets партнёров

Участник попадает в публичный JSON, если запись подтверждена или yClients уже видит оплату:

- `attendance === 2`
- `paid_full === 1`
- `payment_status === 1`

Неоплаченная бронь с `attendance=0`, `paid_full=0`, `payment_status=0` не считается участником и не попадает в публичный список. После оплаты backend дополнительно переводит запись в `attendance=2`, но публичный sync уже может показать участника по факту оплаты.

Публичный JSON не должен содержать:

- телефон
- email
- Telegram
- платежные данные
- внутренние ID
- статусы оплаты

С 7 июня 2026 `event.activity_id` удалён из публичного JSON. `activity_id=44110911` остаётся только во внутреннем backend-конфиге и sync-скрипте для работы с yClients.

Счетчики:

```text
registered = количество подтверждённых или оплаченных участников
capacity = лимит из yClients activity, fallback 30
remaining = max(capacity - registered, 0)
sold_out = remaining <= 0
```

Если `sold_out=true`, основные CTA меняются на `Мест нет`, popup не открывается. До отсечки за 3 дня до старта рядом показывается кнопка `Лист ожидания` с `href="#waiting_list"` и сообщение, что до старта могут освободиться места.

Для события `2026-07-02 10:00` кнопка листа ожидания показывается только до:

```text
2026-06-29 10:00 Europe/Moscow
```

После этой даты лист ожидания скрывается, а sold out-сообщение остаётся коротким: `Все места на чемпионат заняты`.

Статус события:

```text
starts_at = дата и время старта в ISO
ends_at = дата и время окончания в ISO
duration_seconds = длительность события, по умолчанию 10800
status = upcoming | in_progress | completed
is_past = status === completed
```

После окончания события публичный JSON автоматически отдаёт `status=completed` и `is_past=true`. Frontend переводит страницу в архивный режим без ручной правки HTML:

- CTA регистрации меняются на `Чемпионат завершён`;
- popup по прямой ссылке `#mbs-latte-battle-popup` показывает сообщение `Регистрация закрыта`;
- блок участников остаётся на странице как архив подтверждённых участников;
- счётчик свободных мест заменяется на статус `завершён`;
- FAQ и финальный CTA получают архивные формулировки и ведут к контакту/заявке на следующие события.

## Регламент

Регламент — важный документ для участника. На странице есть несколько точек входа:

- кнопка `Регламент` в hero рядом с CTA;
- отдельный блок `Регламент чемпионата` сразу после блока `Как проходит чемпионат`;
- обязательный чекбокс в popup регистрации: `Я ознакомлен(а) с регламентом чемпионата и принимаю правила участия.`

Ссылка регламента хранится в `data-rules-url` корневого блока и используется в popup через `RULES_URL`.

Текущая ссылка в `data-rules-url` ведёт на Google Docs preview, а не на `/edit`:

```text
https://docs.google.com/document/d/1xat9zuJOBpGmpnvRntaEeUEOA79cW9Wx-4OSlUE0bsc/preview
```

Mini App строит PDF-ссылку из этого document id на frontend:

```text
https://docs.google.com/document/d/{document_id}/export?format=pdf
```

Если появится финальный прямой `.pdf` на Tilda/CDN/сайте с открытием inline, заменить `data-rules-url` и все статические hero/rules ссылки в `latte-art-battle.html` на него.

## Согласия И Документы

Юридические согласия взяты из общего booking-widget. Для чемпионата добавлены отдельные обязательные чекбоксы опыта и регламента.

Порядок чекбоксов в popup:

1. Подтверждение опыта работы бариста не более 3 лет — обязательно, frontend-валидация `experienceLimitConsent`, backend-валидация `require_experience_limit_consent`.
2. Регламент чемпионата — обязателен, frontend-валидация `rulesConsent`.
3. Согласие на обработку персональных данных — обязательно, frontend и backend.
4. Информационно-рекламная рассылка — обязательно, frontend и backend.

Ссылки:

```text
Согласие на обработку персональных данных:
https://docs.google.com/document/d/13Q2Qwov_B2vzTI5qh2c3MNOZ-B3gVtDW9T3vyFkAKY0/export?format=pdf

Политика обработки персональных данных:
https://docs.google.com/document/d/1VvQ_XvR-FIq3Xaleas07I-9pfAomrfUNFqPqWFE4H1U/export?format=pdf

Оферта на заключение договора об оказании платных услуг:
https://docs.google.com/document/d/1JgElyS6jSWw8L-h7ZnTpJRtDN56WyVzhm7m7buY-yJA/export?format=pdf
```

Маркетинговое согласие:

```text
Даю согласие ИНН 744517097939 на получение сообщений и информационно-рекламной рассылки.
```

## Обновление Hosted HTML

После изменения `latte-art-battle.html`:

```bash
scp -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no \
  /Users/romansuslin_1/Downloads/All_Code/barista-course/latte-art-battle/latte-art-battle.html \
  root@5.35.93.225:/var/www/html/api/latte-art-battle.html
```

Проверка:

```bash
curl -sS -I https://api.barista-school.ru/api/latte-art-battle.html
curl -sS https://api.barista-school.ru/api/latte-art-battle.html | grep -n -E '@type": "Event"|MBS\* Latte-art'
```

Если менялся loader, нужно обновить HTML-блок в Tilda и опубликовать страницу.

## Обновление Backend

### Telegram-уведомления

Telegram-уведомления отправляет не booking-endpoint, а sync-скрипт `update_latte_art_battle.js`, который запускается cron каждые 5 минут.

Источник истины для отправки:

```text
record.attendance === 2 или record.paid_full === 1 или record.payment_status === 1
```

То есть сообщение уходит после того, как запись попала в статус `Клиент подтвердил` или yClients уже видит оплату.

Env на сервере:

```text
LATTE_ART_BATTLE_TG_BOT_TOKEN=...
LATTE_ART_BATTLE_TG_CHAT_ID=-1003455358196
LATTE_ART_BATTLE_TG_SENT_PATH=/opt/basic-barista-booking/data/latte-art-battle-telegram-sent.json
```

Текущий факт на сервере:

- токен задан в `/opt/basic-barista-booking/.env`;
- chat id задан как `-1003455358196`;
- бот определяется Telegram API как `MBS_work_bot`;
- бот видит чат `MBS Latte-art x Петмол 2026`;
- чат является `supergroup`, поэтому id должен начинаться с `-100`.

Токен бота нельзя хранить в git, README или HTML. Если токен был отправлен в открытый чат, его лучше перевыпустить в BotFather и заменить только в серверном `.env`.

Шаблон сообщения:

```text
Приветствуем нового участника!
Роман @donromon
Место работы: MBS
#участники

Осталось мест 5
```

Правила:

- сообщение отправляется только для новых записей со статусом `attendance=2`;
- если запись в событии есть, но `attendance=0`, сообщение не отправляется;
- уже отправленные записи фиксируются в `LATTE_ART_BATTLE_TG_SENT_PATH`, чтобы не дублировать сообщения при каждом cron-запуске;
- при первом запуске state-файл инициализируется текущими подтвержденными участниками без отправки сообщений, чтобы не заспамить чат старыми записями;
- `Осталось мест` считается от лимита group activity yClients;
- с 22:00 до 09:00 по Москве отправка идет с `disable_notification=true`;
- если Telegram API недоступен, sync-скрипт логирует ошибку, но публичный JSON продолжает обновляться.
- отправка не мгновенная: после ручной смены статуса в yClients нормальная задержка до следующего cron-запуска, максимум около 5 минут.

Проверка Telegram без вывода токена:

```bash
ssh -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no root@5.35.93.225 \
  'cd /opt/basic-barista-booking && \
   awk -F= '\''/^LATTE_ART_BATTLE_TG_BOT_TOKEN=/{print "token_chars=" length($2)} /^LATTE_ART_BATTLE_TG_CHAT_ID=/{print "chat_id=" $2}'\'' .env && \
   cat data/latte-art-battle-telegram-sent.json'
```

Ручная проверка после перевода записи в `Клиент подтвердил`:

```bash
ssh -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no root@5.35.93.225 \
  'cd /opt/basic-barista-booking && /usr/bin/node scripts/update_latte_art_battle.js && tail -40 /var/log/latte-art-battle-sync.log'
```

Ожидаемые логи:

- `telegram_notification_sent` — сообщение отправлено;
- `telegram_notification_skipped: missing_bot_token` — в `.env` нет токена;
- `telegram_notification_failed` — Telegram API вернул ошибку;
- `participants=0` при наличии тестовой записи обычно означает, что запись не в статусе `attendance=2`.

После изменения backend-файлов:

```bash
scp -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no \
  /Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/server/basic-barista-booking-server.js \
  root@5.35.93.225:/opt/basic-barista-booking/server/basic-barista-booking-server.js

scp -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no \
  /Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/courses/latte-art-battle.json \
  root@5.35.93.225:/opt/basic-barista-booking/courses/latte-art-battle.json

ssh -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no root@5.35.93.225 \
  'node --check /opt/basic-barista-booking/server/basic-barista-booking-server.js && \
   python3 -m json.tool /opt/basic-barista-booking/courses/latte-art-battle.json >/tmp/latte-json-check.out && \
   pm2 restart basic-barista-booking --update-env'
```

Проверка booking endpoint:

```bash
curl -sS -X POST https://api.barista-school.ru/api/course-booking/latte-art-battle \
  -H 'Content-Type: application/json' \
  --data '{
    "check_only": true,
    "variant_id": "participant",
    "client": {
      "firstName": "Тест",
      "lastName": "Проверка",
      "phoneCode": "+7",
      "phone": "+79990000000",
      "email": "test@example.com",
      "telegram": "username",
      "projectName": "Codex coffee",
      "agreements": {
        "personalData": true,
        "marketing": false
      }
    },
    "schedule": {
      "lesson_1": {
        "lesson_num": 1,
        "date": "2026-07-02",
        "time": "10:00",
        "staff_id": 1322836,
        "service_id": 14800644,
        "seance_length": 10800
      }
    }
  }'
```

Ожидаемо:

```json
{
  "ok": true,
  "check_only": true,
  "record_create_mode": "activity",
  "activity_id": 44110911
}
```

Проверка обязательных полей:

- без `telegram` должен быть ответ `Заполните Telegram`
- без `projectName` должен быть ответ `Заполните проект / место работы`

## Обновление Public Data JSON

Локальные проверки:

```bash
node --check /Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_latte_art_battle.js
node --test /Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_latte_art_battle.test.js
```

На сервере скрипт:

```text
/opt/basic-barista-booking/scripts/update_latte_art_battle.js
```

Автообновление на сервере настроено через root crontab каждые 5 минут:

```text
*/5 * * * * cd /opt/basic-barista-booking && /usr/bin/node scripts/update_latte_art_battle.js >> /var/log/latte-art-battle-sync.log 2>&1
```

Что это значит для сайта:

- public JSON обновляется максимум раз в 5 минут;
- открытая страница перечитывает JSON каждые 5 минут без перезагрузки;
- после ручного обновления страницы пользователь сразу видит текущий JSON.
- при кратком rate limit yClients sync-скрипт делает несколько повторных попыток перед ошибкой.

Проверка cron:

```bash
ssh -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no root@5.35.93.225 \
  'crontab -l | grep update_latte_art_battle && tail -40 /var/log/latte-art-battle-sync.log'
```

Безопасная локальная генерация без записи в Google Sheets:

```bash
LATTE_ART_BATTLE_SKIP_SHEETS_WRITE=1 \
LATTE_ART_BATTLE_OUTPUT_PATH=/tmp/latte-art-battle-data.json \
node /Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_latte_art_battle.js
```

На сервере после изменения sync-скрипта:

```bash
scp -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no \
  /Users/romansuslin_1/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_latte_art_battle.js \
  root@5.35.93.225:/opt/basic-barista-booking/scripts/update_latte_art_battle.js

ssh -i "$HOME/.ssh/id_ed25519" -o StrictHostKeyChecking=no root@5.35.93.225 \
  'node --check /opt/basic-barista-booking/scripts/update_latte_art_battle.js'
```

## Проверки Frontend

Перед выкладкой HTML:

```bash
node - <<'NODE'
const fs = require('fs');
const html = fs.readFileSync('/Users/romansuslin_1/Downloads/All_Code/barista-course/latte-art-battle/latte-art-battle.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
for (const script of scripts) new Function(script);
console.log('scripts ok', scripts.length);
NODE
```

После выкладки:

```bash
curl -sS -I https://api.barista-school.ru/api/latte-art-battle.html
curl -sS https://api.barista-school.ru/api/latte-art-battle-data.json
```

Что проверить вручную:

- desktop, tablet, mobile
- hero image
- CTA открывает popup
- кнопка `Регламент` в hero открывает регламент в режиме чтения в новой вкладке
- блок `Регламент чемпионата` расположен после механики и открывает тот же документ
- popup сохраняет введенные данные
- Telegram нормализуется к `@username`
- проект / место работы обязателен
- чекбокс подтверждения опыта до 3 лет первый и обязателен
- чекбокс регламента обязателен
- чекбоксы и ссылки документов открываются
- при sold out CTA показывает `Мест нет`; до `2026-06-29 10:00 Europe/Moscow` рядом видна кнопка `Лист ожидания` с `href="#waiting_list"`
- таблица участников не ломается на mobile
- блок призов читается на desktop и mobile
- партнёры выводятся из JSON, последняя строка логотипов центрируется на desktop
- ошибки загрузки участников и судей не ломают страницу
- если hosted HTML не загрузился, через `10` секунд появляется fallback с кнопкой `Написать в Telegram`

## Известные Риски

- Реальную боевую запись нельзя тестировать без договоренности: она создаст запись в событии.
- Сейчас лимит мест берется из `GET /activity/{company_id}/44110911`, поле `capacity`. Если в yClients стоит неправильное значение, сайт и уведомления покажут именно его.
- Если yClients снова поменяет формат `custom_fields`, нужно проверять `updateClientProfile()` и верификацию чтением карточки после `PUT`.
- Если в Битрикс по новому контакту поля Telegram и место работы пустые, синхронизация не должна затирать заполненные значения yClients. Правило на 5 июня 2026: для `telegram` и `mesto-raboti` пустые поля заполняются из непустых в любую сторону; если оба значения заполнены и отличаются, это конфликт без автозатирания.
- Если Google Sheets недоступен, страница должна продолжать работать с аккуратным сообщением.
- Если публичный JSON не обновляется, счетчики и участники могут быть неактуальны.
- Регламент сейчас открыт через Google Docs preview. Это лучше, чем `/edit` и не скачивает файл, но финально можно заменить на прямой `.pdf` на Tilda/CDN/сайте с inline-открытием.
- Если Tilda кеширует loader, нужно поднять query version в `tilda-loader.html`.
- Если API-домен временно недоступен, loader показывает Telegram fallback через `10` секунд. Это не чинит сетевую проблему, но не оставляет клиента на бесконечной загрузке.
- Если в Tilda снова опубликовать старые блоки лендинга вместе с hosted loader, страница станет тяжёлой и может медленно открываться. В Tilda оставлять только loader, необходимые системные блоки, popup листа ожидания и общие header/footer.
- Если не обновить HTML-блок Tilda после правки `tilda-loader.html`, live-исходник Tilda продолжит показывать старый текст `Загружаем страницу чемпионата...`; hosted HTML всё равно загрузится, но статический SEO fallback в исходном HTML не появится.
- Если в Tilda head останется старая JSON-LD `Product / Продвинутый курс`, hosted HTML удаляет её на runtime. Лучше дополнительно убрать старую разметку из head Tilda вручную, чтобы исходный HTML сразу был чистым.
- Если SMTP для booking-сервиса сломается или env `COURSE_BOOKING_SMTP_*` будет удалён, регистрация и оплата продолжат работать, но письма участникам не уйдут; проверять `/opt/basic-barista-booking/.env` и safe-check скрипт.

## Что Не Трогать Без Отдельного Решения

- URL страницы `https://baristaschool.ru/latte_art_battle`
- `activity_id=44110911`
- `service_id=14800644`
- `staff_id=1322836`
- цену `3000 ₽`
- лимит в коде; менять количество мест нужно в group activity yClients
- ссылку регламента в `data-rules-url` без замены на финальный PDF
- структуру публичных данных без проверки приватности
- соседние курсы и общий booking-widget без отдельной задачи

## Краткая История Реализации

- Лендинг вынесен из Tilda в hosted HTML.
- CTA переведен на popup-запись.
- Backend настроен на group activity yClients.
- Добавлены обязательные поля Telegram и проект / место работы.
- Telegram и проект / место работы пишутся в доп. поля клиента yClients через `custom_fields`, основной рабочий формат — объект с API key; после записи backend перечитывает карточку и проверяет сохранение.
- 4 июня 2026 исправлена запись доп. полей клиента: backend делает быстрые повторы после создания записи, если `client_id` ещё не доступен, и страхующий повтор на этапе подтверждения оплаты. Исторический backfill восстановил `mesto-raboti` у текущих клиентов события и часть значений `telegram`, которые были доступны в комментариях.
- 5 июня 2026 исправлено затирание этих полей интеграцией Битрикс ↔ yClients: `telegram` и `mesto-raboti` синхронизируются по fill-empty правилу, пустое значение не перезаписывает заполненное.
- Лимит мест берется из group activity yClients.
- Telegram-уведомление отправляется sync-скриптом после появления статуса `Клиент подтвердил`.
- Email-уведомления отправляет booking-backend: первое письмо со ссылкой оплаты после брони, второе после автоотмены неоплаченной брони.
- Публичная таблица участников получает только безопасные поля.
- 7 июня 2026 из публичного JSON удалён `event.activity_id`, чтобы не отдавать внутренний ID yClients наружу.
- Судьи подтягиваются из Google Sheets по `active` и `sort_order`.
- Партнёры подтягиваются из Google Sheets `partners` и рендерятся отдельной белой секцией в стиле Mixology Cup.
- Блок призов заменён с черновых карточек на карточки мест `2 / 1 / 3` с фактическими призами партнёров.
- Регламент поднят выше на странице, добавлен в hero и в обязательный первый чекбокс popup-регистрации.
- 4 июня 2026 добавлено обязательное подтверждение опыта работы бариста не более 3 лет: frontend-чекбокс, backend-валидация `require_experience_limit_consent`, строка в комментарии записи и истории клиента.
- Старая ссылка `srtme.ru/mbs-latte-art-rools` заменена на Google Docs preview; в Telegram Mini App из этого document id строится PDF-export.
- В клиентских текстах убраны упоминания yClients и внутренней механики записи.
- Для карточек текущих судей на лендинге используются короткие card-copy роли и описания, чтобы карточки были одинаковыми по плотности. Полные описания из JSON остаются в модальном окне `Подробнее`.
- В Telegram Mini App главный hero показывается только на вкладке `Главное`, тёмная тема оформлена отдельной VS Code-like палитрой, регламент открывается как PDF, карточки судей открывают центральный попап, а карта площадки находится только в FAQ.
- 7 июня 2026 Tilda-страница очищена от старых тяжёлых блоков лендинга; актуальная архитектура — hosted loader + hosted HTML. В `tilda-loader.html` добавлен timeout `10` секунд и fallback с кнопкой Telegram школы.
- 8 июня 2026 выполнены SEO-правки: API-дубль `/api/latte-art-battle.html` закрыт через `X-Robots-Tag: noindex, follow`, hosted HTML получил JSON-LD `Event`, старый Tilda schema `Product / Продвинутый курс` удаляется на runtime, `h1` приведён к финальному заголовку `MBS* Latte-art x Петмол — чемпионат по латте-арту`, а `tilda-loader.html` получил статический SEO fallback и `noscript`.
