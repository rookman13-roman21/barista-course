# MBS* Breeew battle

База знаний по лендингу чемпионата Московской школы бариста по альтернативному завариванию кофе.

Актуально на `2026-07-12`.

Страница на сайте:

```text
https://baristaschool.ru/breeew-battle
```

## Событие

- Название на лендинге: `MBS* Breeew battle`
- Формат: чемпионат по альтернативным способам заваривания кофе
- Дата: `2026-08-05`
- Время: `10:00`
- Вступительный взнос: `3000 ₽`
- Лимит участников: `20`
- Площадка: `Московская школа бариста, ул. Нижняя Красносельская, 35, стр. 50`
- Основной способ заваривания: `Hario V60`
- Ограничения по опыту бариста: нет

Регламент:

```text
https://docs.google.com/document/d/1wRhkNyrUWJaMoY9iLb5IvqcFaOp08FQGmG5m0ZHGldo/preview
```

## Архитектура

Страница работает через hosted loader:

1. В Tilda вставляется короткий HTML из `tilda-loader.html`.
2. Loader загружает полный HTML/CSS/JS с API-домена.
3. Основной код страницы живёт в `breeew-battle.html`.
4. Popup регистрации отправляет заявку в backend booking-сервиса.
5. Публичные данные участников, счётчиков, судей и партнёров берутся из JSON.
6. Закрытая Telegram Mini App открывается из чата участников и проверяет членство пользователя в чате.

## Файлы

- `breeew-battle.html` — полный hosted HTML/CSS/JS лендинга и popup записи.
- `telegram-mini-app.html` — закрытая Telegram Mini App памятка для чата участников.
- `tilda-loader.html` — короткий loader для HTML-блока Tilda с timeout и Telegram fallback.
- `README.md` — эта база знаний.

Связанные backend-файлы:

```text
/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking/courses/breeew-battle.json
/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_breeew_battle.js
/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_breeew_battle.test.js
/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking/server/basic-barista-booking-server.js
```

## Публичные URL

```text
https://api.barista-school.ru/api/breeew-battle.html
https://api.barista-school.ru/api/breeew-battle-mini-app.html
https://api.barista-school.ru/api/breeew-battle-data.json
https://api.barista-school.ru/api/courses/breeew-battle/slots.json
https://api.barista-school.ru/api/course-booking/breeew-battle
https://api.barista-school.ru/api/course-booking/breeew-battle/telegram-mini-app-data
https://api.barista-school.ru/api/course-booking/breeew-battle/telegram-bot-webhook
```

Loader в Tilda грузит:

```text
https://api.barista-school.ru/api/breeew-battle.html?v=20260530-1
```

При изменении `tilda-loader.html` нужно заменить HTML-блок в Tilda и опубликовать страницу.

## Tilda

Плановый URL:

```text
https://baristaschool.ru/breeew-battle
```

В Tilda должен быть один HTML-блок с содержимым `tilda-loader.html`.

Не публиковать рядом старые большие Tilda-блоки лендинга. Большой код должен жить в hosted HTML `breeew-battle.html`.

## yClients

Техническая конфигурация события:

```text
schedule-online/basic-barista-booking/courses/breeew-battle.json
```

Найдено через yClients API на production:

- `activity_id`: `46230855`
- `service_id`: `30065058`
- `staff_id`: `1322836`
- `staff_name`: `Анастасия Кадушкина`
- `capacity`: `20`
- `activity_date`: `2026-08-05`
- `activity_time`: `10:00`

Backend создаёт запись в group activity. Если yClients создаст запись не в нужном групповом событии, backend должен отменить такую запись и вернуть ошибку.

Боевые тестовые записи не создавать без отдельного решения.

## Google Sheets

Участники:

```text
https://docs.google.com/spreadsheets/d/1WhQSnSxQ37fSgCoypDljowUd25di2mJKz-_k1u74Ii0/edit
```

Основная вкладка сейчас называется `участники чемпионата 2.07.26`, но технические заголовки подходят:

```text
first_name, last_name, project_name, source, yclients_record_id, status, updated_at
```

Судьи и партнёры:

```text
https://docs.google.com/spreadsheets/d/1aO2_mU1K8tRMbQ5G9Zckw8DZrmahZ8yNDUiC6CoKRxk/edit
```

Вкладки:

```text
judges
partners
```

В `partners` названия партнёров сейчас находятся в дополнительной 8-й колонке без заголовка. Sync-скрипт адаптирован под эту структуру и берёт название оттуда, если стандартное поле `name` пустое.

## Telegram Mini App

Mini App:

```text
https://api.barista-school.ru/api/breeew-battle-mini-app.html
```

Запуск из закреплённого сообщения в Telegram-чате участников:

```text
https://t.me/MBS_work_bot?startapp=breeew_battle_info
```

В групповом чате Telegram не принимает `web_app` inline-кнопку напрямую, поэтому закреп должен вести на direct `startapp` ссылку.

Backend endpoint:

```text
POST /api/course-booking/breeew-battle/telegram-mini-app-data
```

Чат участников:

```text
-1003999345021
```

Бот:

```text
@MBS_work_bot
```

Env хранится только на production в `/opt/basic-barista-booking/.env`:

```text
BREEEW_BATTLE_TG_BOT_TOKEN=...
BREEEW_BATTLE_TG_CHAT_ID=-1003999345021
BREEEW_BATTLE_TG_SENT_PATH=/opt/basic-barista-booking/data/breeew-battle-telegram-sent.json
BREEEW_BATTLE_TG_WEBHOOK_SECRET=...
```

Токены не хранить в HTML, README, git и публичных логах.

Mini App не должна выводить телефоны, email, ссылки оплаты, внутренние `record_id` и Telegram участников.

### Кофе для подготовки

На вкладке `Главное` сразу после hero расположен блок `Как получить кофе для подготовки`. Контент блока приходит из `breeewBattleMiniAppContent()` в `schedule-online/basic-barista-booking/server/basic-barista-booking-server.js`; frontend в `telegram-mini-app.html` только безопасно отрисовывает тексты и ссылки.

Для иногородних участников Mini App открывает CRM-форму для адреса ближайшего ПВЗ СДЭК:

```text
https://baristaschool.bitrix24site.ru/breeew-battle-cdek/
```

В Mini App к ссылке добавляются UTM-метки `utm_source=telegram`, `utm_medium=mini_app`, `utm_campaign=breeew_battle_cdek`.

Участники из Москвы могут забрать кофе самостоятельно в тренинг-центре с `11:00` до `19:00`, предварительно написав в Telegram школы. В блоке доступны две отдельные кнопки:

```text
https://t.me/Moscow_barista_school
https://yandex.ru/maps/org/206204133172
```

Не переносить эту информацию в регламент или FAQ: это оперативный организационный блок для уже подтверждённых участников.

## Проверки

Локально:

```bash
node --check server/basic-barista-booking-server.js
node --check scripts/update_breeew_battle.js
node --test scripts/update_breeew_battle.test.js
```

После выкладки:

```bash
curl -sI https://api.barista-school.ru/api/breeew-battle.html
curl -sS https://api.barista-school.ru/api/breeew-battle-data.json
curl -s -X POST -H "Content-Type: application/json" -d "{}" https://api.barista-school.ru/api/course-booking/breeew-battle
```

Для API-дубля hosted HTML должен быть заголовок:

```text
X-Robots-Tag: noindex, follow
```

На основной странице `https://baristaschool.ru/breeew-battle` такого заголовка быть не должно.
