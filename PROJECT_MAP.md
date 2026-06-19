# PROJECT MAP — barista-course

> Карта проекта для быстрого погружения в контекст.  
> **Ничего не менять без прочтения критических файлов.**

---

## 1. Структура корня

```
barista-course/
├── 404/                      ← Страница ошибки 404
├── _templates/                ← Шаблоны для новых Tilda-страниц
├── about-school/             ← Страница «О школе» (baristaschool.ru/company)
├── barista-interview/        ← Лендинг «Собеседование бариста» (baristaschool.ru/hr)
├── barista-theory-cabinet/   ← Личный кабинет: теория перед курсом (Tilda Members)
├── capping/                  ← Страница каппингов (baristaschool.ru/capping)
├── certificates/             ← Страница подарочных сертификатов (baristaschool.ru/sertifikat)
├── coffee_accounting_webinar/ ← Вебинар «Налоги и финансы в общепите» (baristaschool.ru/coffee_accounting_webinar)
├── excu/                     ← Страница экскурсии на обжарочное производство (baristaschool.ru/excu)
├── home-barista/             ← Лендинг курса «Домашний бариста» (baristaschool.ru/home_barista)
├── home-barista-online/      ← Онлайн-курс «Домашний бариста» (baristaschool.ru/home_barista_online)
├── master-doma/              ← Мастер-класс «Домашнее заваривание» (baristaschool.ru/master_doma)
├── open-coffeeshop/          ← Курс «Открытие кофейни с нуля» (baristaschool.ru/open_coffeeshop)
├── prepay/                   ← Страница предоплаты (baristaschool.ru/prepay)
├── tilda_blocks_others/      ← Разрозненные блоки для других страниц Tilda
├── scripts/                  ← Утилиты разработки (Tilda API, миграции)
├── .vscode/                  ← Настройки редактора (tasks.json: git push)
├── PROJECT.md                ← Общее описание проекта (верхний уровень)
├── PROJECT_MAP.md            ← Этот файл
├── upgrade_lessons.py        ← Скрипт миграции уроков на новый стандарт
└── push-open-coffeeshop.sh   ← Шелл-хелпер для git push (open-coffeeshop)
```

---

## 2. Назначение каждой папки

| Папка | Продакшн URL | Платформа | Краткое описание |
|---|---|---|---|
| `404/` | — | Tilda | Страница 404 — единственный `index.html` + `tilda-block.html` |
| `_templates/` | — | Docs / HTML templates | Шаблоны для новых страниц; `tilda-event-page/` — стартовая структура событийной страницы и мастер-класса |
| `about-school/` | `/company` | Tilda Zero Block | Страница «О школе»: 9 блоков, история школы, тренеры, проекты |
| `barista-interview/` | `/hr` | Tilda Zero Block | B2B-лендинг «Собеседование бариста»: тарифы, FAQ, CTA |
| `barista-theory-cabinet/` | Tilda Members | Tilda Members | Личный кабинет: 11 теоретических уроков перед очным курсом |
| `capping/` | `/capping` | Tilda hosted loader | Страница каппингов: Tilda один раз вставляет loader, актуальный HTML страницы загружается с `api.barista-school.ru` |
| `certificates/` | `/sertifikat` | Tilda Zero Block | Каталог подарочных сертификатов с модальным окном и API |
| `coffee_accounting_webinar/` | `/coffee_accounting_webinar` | Tilda HTML Block | Вебинар «Налоги и финансы в общепите в 2026»: 6 блоков, дата/ссылка из публичного JSON `coffee-accounting-webinar.json`, fallback CTA → `#waiting_list` |
| `excu/` | `/excu` | Tilda HTML Block | Страница экскурсии на обжарочное производство: landing + онлайн-запись из `excursions.json` |
| `home-barista/` | `/home_barista` | Tilda Zero Block | Лендинг офлайн-курса «Домашний бариста»: 8 блоков |
| `home-barista-online/` | `/home_barista_online` | Tilda Members | Онлайн-курс: лендинг + 11 уроков + личный кабинет |
| `master-doma/` | `/master_doma` | Tilda HTML Block | Мастер-класс «Домашнее заваривание»: landing + онлайн-запись из `homebrew.json` |
| `open-coffeeshop/` | `/open_coffeeshop` | Tilda Zero Block | Курс «Открытие кофейни»: 8 блоков, 2 ведущих, 2 тарифа |
| `prepay/` | `/prepay` | Tilda Zero Block | Страница предоплаты: Hero + Курсы + Правила (1 файл `tilda-block.html`) |
| `tilda_blocks_others/` | разные | Tilda | Отдельные Tilda-блоки и hosted-виджеты, включая универсальный блок тренеров и публичный оценочный лист каппинга |
| `scripts/` | — | Node.js | Утилиты: скачивание из Tilda API, миграция уроков |

---

## 3. Главные страницы и где они лежат

| Страница | Файл для Tilda | Файл для локального просмотра |
|---|---|---|
| О школе | `about-school/blocks/block-0*.html` | `about-school/index.html` |
| Собеседование бариста | `barista-interview/index.html` | `barista-interview/index.html` |
| Каппинг кофе | `capping/tilda-loader.html` | `capping/index.html` |
| Подарочные сертификаты | `certificates/tilda-blocks/block-0*.html` | `certificates/index.html` |
| Вебинар по налогам и финансам в общепите | `coffee_accounting_webinar/tilda-blocks/00-seo-and-page-styles.html` → `05-page-scripts.html` | `coffee_accounting_webinar/index.html` |
| Экскурсия на обжарочное производство | `excu/tilda-block.html` | `excu/index.html` |
| Домашний бариста (офлайн) | `home-barista/tilda-blocks/*.html` | `home-barista/index.html` |
| Домашний бариста (онлайн, лендинг) | `home-barista-online/blocks/*.html` | `home-barista-online/index.html` |
| Домашний бариста (онлайн, уроки) | `home-barista-online/pages/lessons/lesson-*.html` | те же файлы |
| Домашнее заваривание | `master-doma/tilda-blocks/00-seo-and-page-styles.html` → `05-page-scripts.html` | `master-doma/index.html` |
| Открытие кофейни | `open-coffeeshop/tilda-blocks/block-*.html` | `open-coffeeshop/index.html` |
| Предоплата | `prepay/tilda-block.html` | `prepay/index.html` |
| Теоретическая подготовка | `barista-theory-cabinet/pages/barista_theory_*.html` | те же файлы |
| 404 | `404/tilda-block.html` | `404/index.html` |
| Универсальный блок тренеров | `tilda_blocks_others/trainers-widget/tilda-block.html` | hosted: `https://api.barista-school.ru/api/trainers-widget.html` |
| Публичный оценочный лист каппинга | `tilda_blocks_others/capping/public-cupping-score-sheet-loader.html` | hosted: `https://api.barista-school.ru/api/public-cupping-score-sheet.html` |

### Правило двух файлов
В большинстве проектов существуют **два файла**:
- `tilda-block.html` / `blocks/block-*.html` — **вставляется в Tilda** (рабочий)
- `index.html` — **обёртка для локального просмотра** (не деплоится)

> ⚠️ При любом изменении редактировать **оба файла**.

### Шаблон новых событийных страниц
Для новых страниц мастер-классов и событий стартовать с:

```
_templates/tilda-event-page/
```

Шаблон задаёт разбиение на Tilda-блоки `00 → 05`, локальное превью `index.html`, паспорт `PROJECT_STATE.md` и README с порядком вставки. Перед созданием страницы всё равно нужно забрать свежий HTML и pageid через Tilda Back, а механику записи определить отдельно: yClients, Tilda Shop, hosted widget или статичная кнопка.

---

## 4. Логика API

### 4.1. Tilda API (scripts/tilda-fetch.js)
```
scripts/tilda-fetch.js
```
- Скачивает HTML страниц с Tilda через `api.tildacdn.info/v1/`
- Ключи читаются из `.env`: переменные `TILDA_PUBLIC_KEY`, `TILDA_SECRET_KEY`
- Маппинг Tilda page ID → папка проекта: `PAGE_MAP` (строки ~20–29)
- Команды:
  ```bash
  node scripts/tilda-fetch.js          # список всех страниц в Tilda
  node scripts/tilda-fetch.js <pageid> # скачать одну страницу
  node scripts/tilda-fetch.js all      # скачать все из PAGE_MAP
  ```

### 4.2. Бэкенд сертификатов (внешний сервер)
- Сервер: `root@159.194.202.120`, порт 3010, PM2 (`yclients-dashboard`)
- Конфиг категорий: `/opt/yclients-dashboard/data/cert-categories.json`
- Этот сервер **не входит** в данный репозиторий

### 4.3. Tilda Members (личные кабинеты)
- `barista-theory-cabinet/pages/` — страницы кабинета теоретической подготовки
- `home-barista-online/pages/` — кабинет онлайн-курса: главная + 11 уроков
- Логика навигации и тестов — JS прямо внутри HTML-файлов (нет внешних API)

### 4.4. Универсальный блок тренеров
- Локальный проект: `tilda_blocks_others/trainers-widget/`.
- В Tilda вставляется один раз короткий loader `tilda-block.html` / `tilda-snippet.html`.
- Актуальная вёрстка, CSS и JS подгружаются с `https://api.barista-school.ru/api/trainers-widget.html`.
- Loader: `https://api.barista-school.ru/trainers-widget.js`.
- Данные: `https://api.barista-school.ru/api/trainers.json`.
- Backend/cron находится в соседнем проекте `schedule-online/basic-barista-booking/scripts/update_trainers.py`.
- Логика показа: сотрудник попадает в блок, если в yClients `specialization` содержит `тренер`, не скрыт в overrides, фото берётся только из overrides, отзывы привязываются по `master_id`, описание берётся из `staff.information`.

### 4.5. Онлайн-запись базового курса
- Popup-обвязка страницы курса находится в `barista-courses/tilda-blocks/09-online-booking-popup.html`.
- Сам виджет и backend онлайн-записи находятся в соседнем проекте `schedule-online/basic-barista-booking`.
- Tilda-блоки онлайн-записи не менять для обновления логики: страница подключает hosted JS `https://api.barista-school.ru/basic-barista-widget.js`, а расписание берётся из `https://api.barista-school.ru/api/basic-barista-slots.json`.
- Backend записи: `POST https://api.barista-school.ru/api/barista-booking` и основной endpoint `POST https://api.barista-school.ru/api/course-booking/basic-barista`.
- Backend после успешной записи сразу убирает занятый слот из JSON расписания; после автоотмены неоплаченной брони и webhook от yClients запускает refresh расписания.
- Для ручных изменений в yClients используется webhook `POST /api/course-booking/basic-barista/yclients-webhook`, защищённый token из production `.env`.
- Cron обновления слотов на production работает каждые 5 минут как fallback.
- Виджет передаёт `staff_preference`: конкретный тренер → категория yClients `Сотрудник важен`, `Любой тренер` → `Сотрудник не важен`.

### 4.6. Онлайн-запись на экскурсии
- Страница: `excu/tilda-block.html`, локальное превью: `excu/index.html`.
- Продакшн URL: `https://baristaschool.ru/excu`.
- Публичное расписание: `https://api.barista-school.ru/api/excursions.json`.
- Fallback расписания: `https://159-194-202-120.sslip.io/api-fallback/api/excursions.json`.
- Страница берёт планируемые события из JSON, фильтрует прошедшие, сортирует по дате/времени и не зависит от конкретного `activity_id`.
- Кнопка «Записаться онлайн» использует `booking_url` конкретного события, но frontend дополнительно проверяет ссылку: только `https` и домены yClients.
- Если API недоступен, используется свежий кэш `localStorage`; если свежего кэша нет, допускается stale-кэш до 12 часов; если данных нет совсем, показываются «Попробовать ещё раз», «Лист ожидания» и Telegram.
- В блоке есть SEO-слой: static JSON-LD `WebPage` / `Service` / `FAQPage` / `BreadcrumbList`, dynamic JSON-LD `Event`, canonical/OG/meta для `/excu`.
- Плавный скролл по якорям перехватывает только реально существующие элементы, чтобы не ломать Tilda-команды `#consalt` и `#waiting_list`.
- Блок «Программа» на desktop — 4 фото-карточки в общей ширине страницы; на mobile карточки листаются горизонтально через CSS `overflow-x` + `scroll-snap`, чтобы секция не занимала большую высоту.

### 4.7. Онлайн-запись на каппинги
- Tilda loader: `capping/tilda-loader.html`, локальное превью: `capping/index.html`.
- Рабочий источник: `capping/tilda-blocks/00-seo-and-page-styles.html` → `05-page-scripts.html`.
- Hosted HTML для сервера: `capping/hosted/capping-page.html`.
- Продакшн URL: `https://baristaschool.ru/capping`.
- Tilda page: `https://tilda.ru/page/?pageid=65688259&projectid=1009188`.
- В Tilda вставляется один раз `capping/tilda-loader.html`; он загружает `https://api.barista-school.ru/api/capping-page.html` и fallback `https://159-194-202-120.sslip.io/api-fallback/api/capping-page.html`.
- Обычные правки делать в `capping/tilda-blocks/`, затем запускать `node capping/build-capping.js` и выкладывать `capping/hosted/capping-page.html` на сервер.
- Полный `capping/tilda-block.html` оставлен как локальный источник/архив и не предназначен для прямой вставки целиком.
- Встроенный виджет берётся из соседнего проекта `schedule-online/capping-schedule-sync/tilda/capping-block.html`.
- Публичное расписание виджета: `https://api.barista-school.ru/api/cuppings.json`.
- Fallback расписания: `https://159-194-202-120.sslip.io/api-fallback/api/cuppings.json`.
- Hero CTA: оставлены две кнопки — `Выбрать дату` и `Оставить заявку` (`#consalt`). На mobile обе кнопки идут на всю ширину: сначала `Оставить заявку`, ниже `Выбрать дату`. Не создавать видимый `id="consalt"`, чтобы Tilda открывала попап заявки.
- Секция «Фото» находится в блоке `04-bottom-content.html` после «Зачем приходить» и перед FAQ. Использует реальные фотоальбомы из `mbs-photo-gallery/catalogs/cuppings` через быстрый `https://api.barista-school.ru/api/gallery-index.json`, отдельные альбомы `https://api.barista-school.ru/api/gallery-albums/{id}.json` и fallback на старый `gallery.json`, если новые файлы ещё не выложены. Паттерн как на `/master_doma`: карточки в один ряд на desktop и mobile, native horizontal scroll со `scroll-snap`, карточки `article role="button" tabindex="0"`, попап фотоальбома создаётся в `document.body`.
- Блок «Зачем приходить» использует отдельный модификатор `mbs-capping-page__section--story`: на desktop уменьшены вертикальные отступы, фото поднято/увеличено, карточки справа уплотнены; на mobile desktop-смещение фото сбрасывается.
- В блоке `01-top-content.html` секции «Как проходит» и «Онлайн-запись» должны оставаться внутри `.mbs-capping-page`; если закрыть обёртку раньше, Tilda начнёт перебивать шрифт.
- Backend, yClients, Google Sheets, cron и `.env` для каппингов находятся вне `barista-course` и не меняются при обновлении страницы.

### 4.8. Публичный оценочный лист каппинга
- Продакшн URL в Tilda: `https://baristaschool.ru/capping_list`.
- В Tilda вставляется только loader `tilda_blocks_others/capping/public-cupping-score-sheet-loader.html`.
- Loader загружает hosted HTML `https://api.barista-school.ru/api/public-cupping-score-sheet.html`.
- Рабочий файл фрагмента: `tilda_blocks_others/capping/public-cupping-score-sheet.html`.
- Это общедоступный лист без личного кабинета, `cupping_id`, Bearer token и серверной отправки данных.
- Данные участника, анкета, лоты, оценки, дескрипторы и заметки сохраняются только в браузере в `localStorage` ключ `mbs-public-cupping-score-sheet-v2`.
- По умолчанию создаются 6 лотов. Лоты можно переименовать, добавить и удалить; последний лот удалить нельзя.
- В анкете есть имя, номер телефона, название каппинга и 4 вопроса про опыт/привычки.
- Логика оценки повторяет смысл листа из ЛК: оценка лотов по критериям 1-5, дескрипторы, заметки, прогресс и итог.
- В итогах есть копирование результата для мессенджера, печать/PDF и CSV; JSON-кнопки и технических надписей для пользователя нет.
- В шапке есть кнопка `Как заполнять`: открывает попап-инструкцию для новичка, не влияет на сохранение и не обязательна для заполнения.
- Публичный лист не связан с `/capping`, итогами фотоальбомов, Dashboard-публикацией, yClients, Битрикс, Google Sheets и серверным сбором ответов.

### 4.9. Онлайн-запись на мастер-класс «Домашнее заваривание»
- Страница: `master-doma/tilda-blocks/00-seo-and-page-styles.html` → `05-page-scripts.html`, локальное превью: `master-doma/index.html`.
- Продакшн URL: `https://baristaschool.ru/master_doma`.
- Tilda page: `https://tilda.ru/page/?pageid=27988719&projectid=1009188`.
- Встроенный виджет берётся из соседнего проекта `schedule-online/homebrew-schedule-sync/tilda/homebrew-block.html`.
- Публичное расписание виджета: `https://api.barista-school.ru/api/homebrew.json`.
- Fallback расписания: `https://159-194-202-120.sslip.io/api-fallback/api/homebrew.json`.
- yClients `service_id`: `10231419` (`Мастер-класс | Домашнее заваривание`).
- Кнопка «Записаться онлайн» использует `booking_url` конкретного события; frontend дополнительно проверяет ссылку: только `https` и домены yClients.
- Если мест нет или ссылку нельзя использовать, виджет показывает «Лист ожидания» (`#waiting_list`).
- Секция расписания плоская: `#mbs-homebrew-widget.mbs-hb` стоит внутри зелёной секции без дополнительной белой карточки страницы.
- Секция тренеров плоская: страница задаёт внешний заголовок, hosted-виджет тренеров не должен быть вложен в декоративную карточку страницы.
- Блоки «Результат» и «Отзывы» удалены из новой сборки страницы.
- Блок фото использует `https://api.barista-school.ru/api/homebrew-gallery.json` и fallback `https://159-194-202-120.sslip.io/api-fallback/api/homebrew-gallery.json`.
- Фотоальбомы на `/master_doma` идут горизонтальным слайдером на desktop и mobile; не возвращать внешнюю белую рамку, декоративные градиенты по краям и многострочную сетку карточек.
- Карточка фотоальбома рендерится как `article role="button" tabindex="0"`, а не `<button>` с блочными элементами внутри; это важно для Safari.
- Обложка карточки лежит в `.mbs-master-doma-page__gallery-img-wrap`, заполняет контейнер через absolute/inset/object-fit; URL Google Drive/LH3 нормализуется до `=s800` для карточек и `=s1600` для попапа.
- По клику, Enter или Space карточка открывает попап фотоальбома со стрелками, счётчиком и миниатюрами.
- Backend, yClients, Google Sheets, cron и `.env` для домашнего заваривания находятся вне `barista-course` и не меняются при обновлении страницы.

### 4.10. Вебинар «Налоги и финансы в общепите в 2026»
- Страница: `coffee_accounting_webinar/tilda-blocks/00-seo-and-page-styles.html` → `05-page-scripts.html`, локальное превью: `coffee_accounting_webinar/index.html`.
- Продакшн URL: `https://baristaschool.ru/coffee_accounting_webinar`.
- Tilda page: `https://tilda.ru/page/?pageid=148220666&projectid=1009188`.
- Источник события: yClients activity `44746455` (`Вебинар | Бухгалтерия для кофеен`).
- Публичный JSON синхронизации сейчас работает через fallback `https://159-194-202-120.sslip.io/api/coffee-accounting-webinar.json`; основной `https://api.barista-school.ru/api/coffee-accounting-webinar.json` пока отдаёт 404.
- Sync находится в соседнем проекте `schedule-online/coffee-accounting-webinar-sync/` и развёрнут на `159.194.202.120` с cron каждые 5 минут.
- Tilda-страница читает JSON в блоке `03`, обновляет дату/ссылку и переключает CTA на `#waiting_list`, если событие прошло, не найдено или мест нет.
- Блок эксперта содержит фото Андрея Лаврищева, смысловые бейджи экспертности и раскрывающуюся карточку с местами работы и компетенциями.

---

## 5. Стили

Проект **не имеет единой CSS-сборки**. Стили организованы по принципу:

### Inline-стили (большинство страниц)
Каждый Tilda-блок содержит `<style>` внутри HTML-файла. Это позволяет вставлять блоки в Tilda независимо.

### Общий CSS для личного кабинета бариста
```
barista-theory-cabinet/assets/css/theory-base.css
```
Базовые стили для всех страниц теории: типографика, переменные, компоненты (карточки, кнопки, тесты).

### CSS-переменные (дизайн-система MBS)
Используются во всех проектах напрямую в `<style>`:
```css
--mbs-green-dark: #417033
--mbs-green:      #4F883E
--mbs-red:        #CC2841
--mbs-bg-light:   #F5F5F5
--mbs-bg-green:   #E7F2E3
```

### Шрифт и иконки (CDN)
```html
<!-- Шрифт — всегда Mulish, подключается в первом блоке страницы -->
<link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap" rel="stylesheet">

<!-- Иконки — Phosphor Icons -->
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
```

---

## 6. Компоненты

Переиспользуемых компонентов в виде отдельных файлов **нет** — архитектура «всё в одном HTML-блоке».  
Повторяющиеся UI-элементы реализованы через копирование с адаптацией:

| Компонент | Где используется |
|---|---|
| Hero-секция (H1 + CTA + бейджи) | все лендинги: `**/block-01-hero.html` или `01-hero.html` |
| Карточки с иконками Phosphor | `advantages`, `skills`, `deliverables` блоки |
| Аккордеон FAQ | `certificates/tilda-blocks/block-03-faq.html`, `barista-interview/index.html`, `home-barista/tilda-blocks/06-faq.html` |
| Карточки тренеров | `about-school/blocks/block-05-trainers.html`, `open-coffeeshop/tilda-blocks/block-04-trainers.html` |
| Универсальный hosted-блок тренеров | `tilda_blocks_others/trainers-widget/` |
| Тарифные карточки | `home-barista/tilda-blocks/04-pricing.html`, `open-coffeeshop/tilda-blocks/block-07-price.html` |
| Финальный CTA | все лендинги: последний `block-*-cta.html` |
| Навигация уроков (кабинет) | `barista-theory-cabinet/assets/js/theory.js` |

---

## 7. Конфиги

| Файл | Назначение |
|---|---|
| `*/vercel.json` | `{"cleanUrls": true, "trailingSlash": false}` — конфиг маршрутизации (Vercel не используется, файл защитный) |
| `.vscode/tasks.json` | Одна задача: `git-push-home-barista` — push через скрипт `/tmp/git_hb_push.sh` |
| `scripts/tilda-fetch.js` | Содержит Tilda API ключи и маппинг page ID → папка |
| `barista-theory-cabinet/assets/css/theory-base.css` | Базовые стили кабинета теории |
| `barista-theory-cabinet/assets/js/theory.js` | JS навигации и тестов для кабинета теории |

---

## 8. ⚠️ Критические файлы — требуют осторожности

| Файл | Почему критический |
|---|---|
| `certificates/tilda-blocks/block-02-catalog.html` | Каталог сертификатов + модальное окно + JS запросов к бэкенду. Ломает продажи при ошибке |
| `prepay/tilda-block.html` | Единственный рабочий файл страницы предоплаты (~729 строк). Нет резервной копии блоков |
| `barista-theory-cabinet/pages/barista_theory_*.html` | 11 страниц кабинета. Ссылки между уроками захардкожены внутри каждого файла |
| `home-barista-online/pages/lessons/lesson-*.html` | 11 уроков онлайн-курса — навигация захардкожена, шаблон в `_lesson-template.html` |
| `home-barista-online/index.html` | Сборный файл (~3300 строк): содержит все блоки лендинга и все стили. Изменения по блокам — в `blocks/`, потом синхронизировать сюда |
| `about-school/index.html` | Аналогично — сборный файл для `blocks/` |
| `scripts/tilda-fetch.js` | Содержит живые Tilda API ключи — не публиковать без проверки |

---

## 9. Как запускать проект локально

**Никакого сервера, сборщика и npm не требуется.**

### Способ 1 — VS Code Live Preview (рекомендуется)
1. Открыть нужный `index.html` в VS Code
2. ПКМ на файле → **Show Preview** (расширение Live Preview)
3. Изменения отображаются при сохранении файла

### Способ 2 — браузер напрямую
1. `File → Open File` в браузере
2. Открыть `index.html` нужного проекта
3. Перезагружать вручную после каждого изменения

### Способ 3 — любой статический сервер
```bash
# Из папки нужного проекта
npx serve .
# или
python3 -m http.server 8080
```

### Для скачивания страниц из Tilda
```bash
node scripts/tilda-fetch.js          # список страниц
node scripts/tilda-fetch.js <pageid> # скачать конкретную
```

---

## 10. Как проверять изменения

### Перед коммитом
1. Открыть изменённый `index.html` через Live Preview
2. Проверить на разных ширинах окна: `1440px`, `768px`, `375px`
3. Если менялся Tilda-блок — открыть соответствующий `tilda-block.html` / `block-*.html` напрямую

### После вставки в Tilda
1. Открыть страницу на продакшне: `baristaschool.ru/<alias>`
2. Проверить шрифты (Mulish), иконки (Phosphor), адаптив
3. Проверить все интерактивные элементы: FAQ-аккордеон, кнопки CTA, формы

### Правило синхронизации index.html ↔ блоки
- Изменения в блоке (`blocks/block-*.html`) → перенести в `index.html` вручную
- Изменения в `index.html` → синхронизировать обратно в нужный блок

### Для кабинета бариста (barista-theory-cabinet)
- Каждая страница самодостаточна — проверять каждый файл отдельно
- Проверять работу тестов (кнопки ответов, финальный экран)
- Проверять ссылки «следующий урок» в конце каждой страницы

### Git push
```bash
# Через задачу VS Code:
# Ctrl+Shift+P → Tasks: Run Task → git-push-home-barista
```

---

## Быстрая навигация по ключевым файлам

```
scripts/tilda-fetch.js                           ← Tilda API утилита
certificates/tilda-blocks/block-02-catalog.html  ← Каталог сертификатов (критично)
prepay/tilda-block.html                          ← Страница предоплаты (критично)
barista-theory-cabinet/assets/css/theory-base.css ← Единственный общий CSS
barista-theory-cabinet/assets/js/theory.js       ← JS для кабинета теории
home-barista-online/pages/lessons/_lesson-template.html ← Шаблон урока
home-barista-online/index.html                   ← Сборный файл онлайн-курса
upgrade_lessons.py                               ← Скрипт миграции уроков
```
