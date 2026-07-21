# Partners Catalog — публичная страница партнёров

Публичный каталог партнёров Московской школы бариста для людей, которые открывают кофейню. Битрикс остаётся админкой, сервер отдаёт безопасный JSON и hosted HTML, Tilda показывает страницу через короткий loader.

## Файлы

- `partners-catalog.html` — самодостаточная HTML/CSS/JS-страница прототипа.
- `tilda-loader.html` — короткий код, который один раз вставляется в HTML-блок Tilda на `https://baristaschool.ru/all-partners`.
- `hosted-partners-catalog.html` — полный HTML/CSS/JS блока, который публикуется на сервере как `https://api.barista-school.ru/api/partners-catalog.html`.
- `tilda-snippet.html` — полный код блока для ручной вставки в Tilda; оставлен как архивный вариант, но основной способ публикации теперь через loader.
- `DATA_CONTRACT.md` — контракт публичного JSON.
- `mock/partners.json` — безопасные тестовые данные для локальной проверки.
- `assets/categories/` — локальные изображения карточек категорий.

## Архитектура

```text
Битрикс, карточки компаний COMPANY_TYPE=PARTNER
  -> bitrix-tools/scripts/export_public_partners.py
  -> публичный JSON https://api.barista-school.ru/api/partners.json
  -> hosted HTML https://api.barista-school.ru/api/partners-catalog.html
  -> tilda-loader.html на странице Tilda
```

Tilda не обращается в Битрикс напрямую и не содержит токены. Страница читает только публичный JSON.

Изображения категорий хранятся рядом с блоком в `assets/categories/`. Не подключать их напрямую со старой страницы Tilda или `static.tildacdn.com`: если старая база знаний будет удалена, новый каталог должен продолжить показывать свои локальные картинки.

План публикации: каталог, JSON и ассеты живут на нашем сервере, а Tilda получает только лёгкий loader, который подтягивает актуальный hosted HTML с сервера. Так Tilda остаётся витриной, а источником правды остаются Битрикс и серверная выгрузка. После установки loader в Tilda следующие правки верстки нужно деплоить только на сервер, без замены кода в Tilda.

В hosted HTML корневой блок должен смотреть на боевые endpoints:

```html
data-partners-api-url="https://api.barista-school.ru/api/partners.json"
data-partners-assets-base-url="https://api.barista-school.ru/partners-catalog/"
```

Так JSON и изображения категорий грузятся с нашего сервера, а не хранятся внутри Tilda.

Готовый файл для одноразовой вставки в Tilda:

```text
tilda-loader.html
```

Перед публикацией на Tilda на сервере должны быть доступны:

- `https://api.barista-school.ru/api/partners-catalog.html`
- `https://api.barista-school.ru/api/partners.json`
- `https://api.barista-school.ru/partners-catalog/assets/categories/...`

Поведение страниц:

- `https://baristaschool.ru/all-partners` показывает карточки категорий.
- `https://baristaschool.ru/all-partners?category=coffee` показывает список компаний внутри выбранной категории без большой сетки категорий.
- `https://baristaschool.ru/all-partners?category=coffee&partner=rockets` открывает карточку конкретного партнёра поверх списка категории. Параметр `partner` равен публичному `slug` из `partners.json`.
- Кнопка `← Все категории` возвращает на `/all-partners`.
- Поиск на странице категории ищет внутри выбранной категории и не сбрасывает пользователя обратно ко всем категориям после очистки поля.
- Поиск использует простой словарь синонимов: кофемашина/эспрессо-машина, касса/POS/CRM/учёт, вода/фильтр/осмос, посуда/чашки/стаканы, сиропы/специи, форма/фартук, химия/чистка и другие базовые термины.
- Если в категории ничего не найдено, пустое состояние предлагает поискать тот же запрос во всех категориях, очистить поиск или вернуться к категориям.

Категории поддерживают отдельные URL через query-параметр:

```text
partners-catalog.html?category=coffee
partners-catalog.html?category=equipment
partners-catalog.html?category=water
```

Карточку партнёра можно передать прямой ссылкой. При открытии карточки адрес обновляется, а закрытие убирает только параметр `partner` и сохраняет текущую категорию. Некорректный или снятый с публикации `slug` не открывает модальное окно и автоматически очищается из URL.

Если позже понадобится SEO-структура, эти адреса можно заменить на красивые маршруты вида `/partners/coffee`, `/partners/equipment`, `/partners/water`, но текущая рабочая схема для Tilda — query-параметр `category`.

## Деплой

После правок интерфейса:

```bash
scp tilda_blocks_others/partners-catalog/hosted-partners-catalog.html root@5.35.93.225:/var/www/html/api/partners-catalog.html
```

После правок данных в Битрикс production JSON обновляет cron на сервере:

```text
/etc/cron.d/mbs-public-partners
```

Локально можно пересобрать только безопасный `mock/partners.json` для проверки интерфейса:

```bash
cd /Users/Romka/Downloads/All_Code/bitrix-tools
.venv/bin/python scripts/export_public_partners.py --output ../barista-course/tilda_blocks_others/partners-catalog/mock/partners.json
```

Не выкладывать `mock/partners.json` вручную в production: живой `/api/partners.json` должен писать серверный cron из актуального Битрикс-экспорта.

Если менялись изображения категорий:

```bash
scp tilda_blocks_others/partners-catalog/assets/categories/*.jpg root@5.35.93.225:/var/www/html/partners-catalog/assets/categories/
```

Публичные server routes:

- `/api/partners-catalog.html` -> `/var/www/html/api/partners-catalog.html`, `Cache-Control: no-store`, CORS `*`.
- `/api/partners.json` -> `/var/www/html/api/partners.json`, CORS `*`.
- `/partners-catalog/` -> `/var/www/html/partners-catalog/`, CORS `*`, cache 1 день.

Nginx backup перед добавлением hosted route: `/root/nginx-backups/barista-api.bak-partners-hosted-20260709-161938`.

## Локальная проверка

Открыть:

```text
partners-catalog.html
```

При локальном открытии браузер может заблокировать чтение `mock/partners.json`; в этом случае страница покажет встроенный демо-набор.

Для проверки на реальной выгрузке:

```bash
cd /Users/Romka/Downloads/All_Code/bitrix-tools
.venv/bin/python scripts/export_public_partners.py --output ../barista-course/tilda_blocks_others/partners-catalog/mock/partners.json
```

## Что управляется в Битрикс

Существующие поля:

- `COMPANY_TYPE=PARTNER` — базовый отбор.
- `TITLE` — название.
- `LOGO` — логотип компании.
- `WEB` — сайт.
- `UF_CRM_1755378655628` — Telegram.
- `UF_CRM_1766177865141` — Instagram.
- `UF_CRM_1771954597298` — публичная страница на сайте.
- `UF_CRM_1756816250945` — тип партнёрства для безопасных бейджей.
- `UF_CRM_1766258826199` — существующая публичная заметка/описание, если в ней нет приватных данных.

Новые поля:

- `Разрешить публикацию на сайте` (`UF_CRM_MBS_PARTNER_PUBLISH`, `XML_ID=MBS_PARTNER_PUBLISH_ON_SITE`) — главный переключатель попадания компании в каталог.
- `Публичная заметка / описание партнёра` (`UF_CRM_MBS_PARTNER_PUBLIC_DESCRIPTION`, `XML_ID=MBS_PARTNER_PUBLIC_DESCRIPTION`) — текст для подробной карточки.
- `Чем полезен при открытии кофейни` (`UF_CRM_MBS_PARTNER_USEFUL_FOR`, `XML_ID=MBS_PARTNER_USEFUL_FOR`) — пункты пользы, можно писать с новой строки.

Подробности описаны в:

```text
/Users/Romka/Downloads/All_Code/bitrix-tools/docs/public-partners-catalog.md
```

## Безопасность

Не публиковать:

- телефоны;
- обычные CRM email;
- внутренние условия и инструкции;
- публичную страницу партнёра как отдельное поле;
- тип партнёрства;
- Drive/Bitrix Disk ссылки;
- служебные ID и `UF_CRM_*` ключи;
- секреты и webhook URL.

Текущие внутренние условия партнёров можно использовать только как рабочую заметку; exporter их не публикует.
