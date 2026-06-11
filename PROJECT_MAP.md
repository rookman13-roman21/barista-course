# PROJECT MAP — barista-course

> Карта проекта для быстрого погружения в контекст.  
> **Ничего не менять без прочтения критических файлов.**

---

## 1. Структура корня

```
barista-course/
├── 404/                      ← Страница ошибки 404
├── about-school/             ← Страница «О школе» (baristaschool.ru/company)
├── barista-interview/        ← Лендинг «Собеседование бариста» (baristaschool.ru/hr)
├── barista-theory-cabinet/   ← Личный кабинет: теория перед курсом (Tilda Members)
├── capping/                  ← Страница каппингов (baristaschool.ru/capping)
├── certificates/             ← Страница подарочных сертификатов (baristaschool.ru/sertifikat)
├── excu/                     ← Страница экскурсии на обжарочное производство (baristaschool.ru/excu)
├── home-barista/             ← Лендинг курса «Домашний бариста» (baristaschool.ru/home_barista)
├── home-barista-online/      ← Онлайн-курс «Домашний бариста» (baristaschool.ru/home_barista_online)
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
| `about-school/` | `/company` | Tilda Zero Block | Страница «О школе»: 9 блоков, история школы, тренеры, проекты |
| `barista-interview/` | `/hr` | Tilda Zero Block | B2B-лендинг «Собеседование бариста»: тарифы, FAQ, CTA |
| `barista-theory-cabinet/` | Tilda Members | Tilda Members | Личный кабинет: 11 теоретических уроков перед очным курсом |
| `capping/` | `/capping` | Tilda HTML Block | Страница каппингов: landing + встроенный текущий виджет расписания из `schedule-online/capping-schedule-sync` |
| `certificates/` | `/sertifikat` | Tilda Zero Block | Каталог подарочных сертификатов с модальным окном и API |
| `excu/` | `/excu` | Tilda HTML Block | Страница экскурсии на обжарочное производство: landing + онлайн-запись из `excursions.json` |
| `home-barista/` | `/home_barista` | Tilda Zero Block | Лендинг офлайн-курса «Домашний бариста»: 8 блоков |
| `home-barista-online/` | `/home_barista_online` | Tilda Members | Онлайн-курс: лендинг + 11 уроков + личный кабинет |
| `open-coffeeshop/` | `/open_coffeeshop` | Tilda Zero Block | Курс «Открытие кофейни»: 8 блоков, 2 ведущих, 2 тарифа |
| `prepay/` | `/prepay` | Tilda Zero Block | Страница предоплаты: Hero + Курсы + Правила (1 файл `tilda-block.html`) |
| `tilda_blocks_others/` | разные | Tilda | Отдельные Tilda-блоки и hosted-виджеты, включая универсальный блок тренеров |
| `scripts/` | — | Node.js | Утилиты: скачивание из Tilda API, миграция уроков |

---

## 3. Главные страницы и где они лежат

| Страница | Файл для Tilda | Файл для локального просмотра |
|---|---|---|
| О школе | `about-school/blocks/block-0*.html` | `about-school/index.html` |
| Собеседование бариста | `barista-interview/index.html` | `barista-interview/index.html` |
| Каппинг кофе | `capping/tilda-blocks/00-seo-and-page-styles.html` → `05-page-scripts.html` | `capping/index.html` |
| Подарочные сертификаты | `certificates/tilda-blocks/block-0*.html` | `certificates/index.html` |
| Экскурсия на обжарочное производство | `excu/tilda-block.html` | `excu/index.html` |
| Домашний бариста (офлайн) | `home-barista/tilda-blocks/*.html` | `home-barista/index.html` |
| Домашний бариста (онлайн, лендинг) | `home-barista-online/blocks/*.html` | `home-barista-online/index.html` |
| Домашний бариста (онлайн, уроки) | `home-barista-online/pages/lessons/lesson-*.html` | те же файлы |
| Открытие кофейни | `open-coffeeshop/tilda-blocks/block-*.html` | `open-coffeeshop/index.html` |
| Предоплата | `prepay/tilda-block.html` | `prepay/index.html` |
| Теоретическая подготовка | `barista-theory-cabinet/pages/barista_theory_*.html` | те же файлы |
| 404 | `404/tilda-block.html` | `404/index.html` |
| Универсальный блок тренеров | `tilda_blocks_others/trainers-widget/tilda-block.html` | hosted: `https://api.barista-school.ru/api/trainers-widget.html` |

### Правило двух файлов
В большинстве проектов существуют **два файла**:
- `tilda-block.html` / `blocks/block-*.html` — **вставляется в Tilda** (рабочий)
- `index.html` — **обёртка для локального просмотра** (не деплоится)

> ⚠️ При любом изменении редактировать **оба файла**.

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
- Страница: `capping/tilda-block.html`, локальное превью: `capping/index.html`.
- Продакшн URL: `https://baristaschool.ru/capping`.
- Tilda page: `https://tilda.ru/page/?pageid=65688259&projectid=1009188`.
- Страница сделана по подходу `/excu`, но для Tilda разложена на 6 HTML-блоков в `capping/tilda-blocks/`, потому что полный `capping/tilda-block.html` слишком большой для вставки одним блоком.
- В Tilda вставлять строго по порядку `00 → 05`; полный `capping/tilda-block.html` оставлен только как локальный источник/архив и не предназначен для прямой вставки целиком.
- Встроенный виджет берётся из соседнего проекта `schedule-online/capping-schedule-sync/tilda/capping-block.html`.
- Публичное расписание виджета: `https://api.barista-school.ru/api/cuppings.json`.
- Fallback расписания: `https://159-194-202-120.sslip.io/api-fallback/api/cuppings.json`.
- Hero CTA: оставлены две кнопки — `Выбрать дату` и `Оставить заявку` (`#consalt`). На mobile обе кнопки идут на всю ширину: сначала `Оставить заявку`, ниже `Выбрать дату`. Не создавать видимый `id="consalt"`, чтобы Tilda открывала попап заявки.
- Блок «Зачем приходить» использует отдельный модификатор `mbs-capping-page__section--story`: на desktop уменьшены вертикальные отступы, фото поднято/увеличено, карточки справа уплотнены; на mobile desktop-смещение фото сбрасывается.
- В блоке `01-top-content.html` секции «Как проходит» и «Онлайн-запись» должны оставаться внутри `.mbs-capping-page`; если закрыть обёртку раньше, Tilda начнёт перебивать шрифт.
- Backend, yClients, Google Sheets, cron и `.env` для каппингов находятся вне `barista-course` и не меняются при обновлении страницы.

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
