# База знаний: Страница подарочных сертификатов MBS

> Файл для быстрого погружения в контекст проекта при продолжении работы.

---

## 1. Что это за проект

Лендинг **подарочных сертификатов** Московской школы бариста.

| Параметр | Значение |
|---|---|
| **Продакшн URL** | `https://baristaschool.ru/sertifikat` |
| **Платформа** | Tilda — каждый блок вставляется как отдельный HTML-блок (Zero Block / T123) |
| **Деплой** | Вставка блоков в Tilda Zero Block; превью — VS Code Live Preview |
| **Локальная папка** | `/Users/romansuslin_1/Downloads/All_Code/barista-course/certificates/` |
| **Бэкенд API** | `server.js` на `root@159.194.202.120`, порт 3010, PM2 (`yclients-dashboard`) |
| **Конфиг категорий** | `/opt/yclients-dashboard/data/cert-categories.json` (без деплоя кода) |

---

## 2. Структура файлов

```
certificates/
├── index.html                    ← standalone-версия (не в Tilda, для превью)
├── vercel.json                   ← конфиг маршрутизации (cleanUrls/trailingSlash)
└── tilda-blocks/
    ├── block-00-seo.html         ← вставляется в <head> страницы Tilda
    ├── block-01-hero.html        ← Hero-секция + подключение шрифтов/иконок
    ├── block-02-catalog.html     ← Каталог сертификатов + модальное окно
    ├── block-03-faq.html         ← Аккордеон FAQ
    └── block-04-cta.html         ← CTA «Не знаете, какой выбрать?»
```

### Порядок блоков в Tilda (сверху вниз):
1. `block-00-seo.html` → настройки страницы → HTML в `<head>`
2. `block-01-hero.html`
3. `block-02-catalog.html`
4. `block-03-faq.html`
5. `block-04-cta.html`

> ⚠️ `block-01-hero.html` **обязательно должен идти первым** — он подключает Google Fonts и Phosphor Icons. Остальные блоки рассчитывают на то, что шрифты уже загружены.

---

## 3. Внешние зависимости

| Ресурс | Подключение | Где |
|---|---|---|
| Шрифт Mulish (Google Fonts) | `<link>` тег | `block-01-hero.html` |
| Phosphor Icons v2.1.1 | `<script src="https://unpkg.com/@phosphor-icons/web@2.1.1">` | `block-01-hero.html` |
| API сертификатов | primary: `https://api.barista-school.ru/api/public/certificates`; fallback: `https://159-194-202-120.sslip.io/api/public/certificates` | `block-02-catalog.html` |
| YClients (оформление заказа) | `https://o3059.yclients.com/certificates/` | `block-02-catalog.html` |

---

## 4. API сертификатов

**Primary endpoint:** `GET https://api.barista-school.ru/api/public/certificates`

**Fallback endpoint:** `GET https://159-194-202-120.sslip.io/api/public/certificates`

Primary endpoint настроен на сервере `5.35.93.225` в nginx-файле `/etc/nginx/sites-enabled/barista-api` как proxy location на реальный backend `YClients-Dashboard`:

```nginx
location = /api/public/certificates {
  proxy_pass https://159-194-202-120.sslip.io/api/public/certificates;
  proxy_ssl_server_name on;
  proxy_set_header Host 159-194-202-120.sslip.io;
}
```

Причина: у части пользователей из России `sslip.io` / сервер `159.194.202.120` может открываться нестабильно. Для браузера первым должен быть более стабильный домен `api.barista-school.ru`, старый `sslip.io` остаётся только fallback.

После проблемы с плавающей доступностью из РФ на старом host `159-194-202-120.sslip.io` также отключён TLS 1.3: в `/etc/nginx/sites-enabled/yclients-dashboard` на `159.194.202.120` задано `ssl_protocols TLSv1.2;`. Backup перед правкой: `/root/nginx-backups/yclients-dashboard.bak-tls12-certificates-20260625-082741`.

Frontend дополнительно сохраняет последний успешный ответ в `localStorage` ключ `mbs-certificates-catalog-v1` на 6 часов. Если оба endpoint временно недоступны, но кеш свежий, каталог всё равно отрисуется.

Возвращает объект с категориями:
```json
{
  "ok": true,
  "total": 47,
  "categories": [
    {
      "slug": "barista",
      "title": "Для бариста",
      "items": [
        {
          "id": 12345,
          "title": "Подарочный сертификат — Обучение — Базовый курс бариста",
          "balance": 12000,
          "is_multi": false,
          "expiration_type_id": 2,
          "expiration_timeout": 12,
          "expiration_timeout_unit_id": 2,
          "expiration_date": null,
          "description": "HTML-описание курса",
          "image": "https://..."
        }
      ]
    }
  ]
}
```

**Категории (category_id из YClients → slug):**
| category_id | slug | Название |
|---|---|---|
| 2769 | `barista` | Для бариста |
| 2772 | `owners` | Открыть кофейню |
| 2775 | `hobby` | Для любителей |
| 2781 | `masterclass` | Мастер-классы |
| 2778 | `nominal` | Номинальные |

> Порядок вкладок: `KNOWN_ORDER = [2769, 2772, 2775, 2781, 2778]` в `server.js`

**Фильтрация:** сертификаты с `online_sale_is_enabled === false` **исключаются** из публичного API.

**Кэш:** 5 минут (`Cache-Control: public, max-age=300` + in-memory `_certCache`).

**Оформление покупки:** `https://o3059.yclients.com/certificates/{id}`

---

## 4.1 Управление категориями без деплоя кода

Конфиг хранится в **`/opt/yclients-dashboard/data/cert-categories.json`** (локально: `YClients-Dashboard/data/cert-categories.json`).

```json
{
  "categories": {
    "2769": { "slug": "barista",     "title": "Для бариста" },
    "2772": { "slug": "owners",      "title": "Открыть кофейню" },
    "2775": { "slug": "hobby",       "title": "Для любителей" },
    "2778": { "slug": "nominal",     "title": "Номинальные" },
    "2781": { "slug": "masterclass", "title": "Мастер-классы" }
  }
}
```

**Как изменить название категории без деплоя кода:**
1. Отредактировать `/opt/yclients-dashboard/data/cert-categories.json` на сервере (через SSH)
2. Или обновить локальный файл и задеплоить через задачу `Deploy to server`
3. Перезапустить PM2: `pm2 restart yclients-dashboard --update-env`

**Логика fallback в `server.js`:**
1. Пробует получить название из `cert-categories.json`
2. Если файл не читается — использует хардкод (`TITLE_FALLBACK`, `SLUG_BY_ID`)
3. Также пробует подтянуть названия из YClients API `/loyalty/certificate_type_categories` (но для этого аккаунта **не работает**)

**Добавление новой категории:** добавить запись `"NEW_ID": {"slug": "...", "title": "..."}` в JSON — новые категории без записи автоматически появляются с именем `Категория {id}`.

---

## 5. CSS-переменные (цвета)

Объявляются в `:root` каждого блока (дублируются намеренно для независимости блоков):

```css
--mbs-green-dark: #417033;   /* Основной зелёный: лейблы, иконки */
--mbs-green:      #4F883E;   /* Зелёные акценты, hover */
--mbs-green-light:#B6D8AB;   /* Рамки, пунктиры */
--mbs-bg-green:   #E7F2E3;   /* Светло-зелёный фон карточек CTA */
--mbs-red:        #CC2841;   /* CTA-кнопки покупки */
--mbs-red-soft:   #D83D54;   /* Hover для красных кнопок */
--mbs-bg:         #F5F5F5;   /* Серый фон (блок каталога) */
--mbs-black:      #1F1F1F;   /* Основной текст */
--mbs-gray:       #555555;   /* Второстепенный текст */
--mbs-white:      #FFFFFF;   /* Белый фон */
```

---

## 6. Модальное окно — как устроено

### Проблема с Tilda
Tilda оборачивает блоки в контейнеры с `transform`/`opacity` → `position: fixed` перестаёт работать корректно.

### Решение: DOM через JS → `document.body`

Вся модалка создаётся **динамически через `createElement`** в функции `createModalDOM()` и вставляется через `document.body.appendChild()` — за пределами stacking context Tilda.

Все стили задаются **инлайн через `style.cssText`** — Tilda не может их перезаписать.

### Ключевые функции в `block-02-catalog.html`:

```javascript
createModalDOM()   // создаёт backdrop + modal и вставляет в body
openModal(data)    // показывает модалку с данными сертификата
closeModal()       // скрывает с анимацией (opacity → 0, затем display: none)
```

### Кнопка закрытия (крестик) — обязательные стили:
```css
width: 32px; min-width: 32px;
height: 32px; min-height: 32px;
border-radius: 50%;
box-sizing: border-box;
padding: 0;
```
> ⚠️ Без `min-width`/`min-height` flex-контейнер растягивает кнопку в **овал**.

### Анимация открытия/закрытия:
```javascript
// Открытие: сначала display, потом opacity (forced reflow между ними)
el.style.display = 'flex';
el.offsetHeight; // forced reflow
el.style.opacity = '1';
el.style.transform = 'translate(-50%, -50%) translateY(0)';

// Закрытие: opacity → 0, потом display: none через setTimeout
el.style.opacity = '0';
setTimeout(() => { el.style.display = 'none'; }, 300);
```

### Блокировка скролла (в т.ч. iOS):
```javascript
function lockScroll(e) { e.preventDefault(); }
document.addEventListener('touchmove', lockScroll, { passive: false });
// при закрытии:
document.removeEventListener('touchmove', lockScroll);
document.body.style.overflow = '';
```

---

## 7. Каталог сертификатов — логика группировки

Функция `groupCerts(items)` объединяет одиночные и парные сертификаты:

- Если у сертификата есть парная версия «для двоих» (`для двоих`, `2 участника` и т.д.) — они объединяются в одну карточку с переключателем 1/2 участника.
- Карточка отображает цену «от X ₽» (минимальная из пары).
- Если стоимость «на двоих» < стоимость «1 участник × 2», показывается бейдж экономии.

**Функции обработки названий:**
```javascript
cleanTitle(t)      // убирает префиксы «Подарочный сертификат — Обучение — »
stripDuoSuffix(t)  // убирает суффиксы «для двоих», «2 участника» и т.д.
normSoloTitle(t)   // убирает trailing «кофе», «1 участника» и т.д.
```

---

## 8. FAQ аккордеон — структура

### CSS-паттерн (без дёргания текста):
```css
.mbs-cert-faq__a {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.35s ease;
  padding: 0 20px;     /* только горизонтальный padding */
}
.mbs-cert-faq__a.open {
  max-height: 400px;
  padding: 0 20px 20px; /* добавляется только padding-bottom */
}

/* Внутренняя обёртка — предотвращает прыжок текста */
.mbs-cert-faq__a__inner {
  padding-top: 12px;
}
```

### HTML-структура (обязательна):
```html
<div class="mbs-cert-faq__item">
  <button class="mbs-cert-faq__q">Вопрос <i class="ph ph-caret-down"></i></button>
  <div class="mbs-cert-faq__a">
    <div class="mbs-cert-faq__a__inner">Текст ответа</div>
  </div>
</div>
```

> ⚠️ Обёртка `__inner` обязательна — без неё `padding` анимируется вместе с `max-height` и текст «прыгает» при открытии.

### JS-логика:
```javascript
btn.addEventListener('click', () => {
  const isOpen = answerEl.classList.contains('open');
  // закрыть все остальные
  document.querySelectorAll('.mbs-cert-faq__a.open').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.mbs-cert-faq__q.active').forEach(el => el.classList.remove('active'));
  // открыть текущий если был закрыт
  if (!isOpen) {
    answerEl.classList.add('open');
    btn.classList.add('active');
  }
});
```

---

## 9. Кнопка «Помочь с выбором» — попап консультации

**Якорь:** `href="#consalt"` (без `_sert` — это старый вариант, не использовать)

Кнопки с таким `href` перехватываются через JS и открывают модалку консультации:

```javascript
document.querySelectorAll('a[href="#consalt"]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openConsultModal();
  });
});
```

Файлы, где встречается `href="#consalt"`:
- `block-01-hero.html` — кнопка Hero
- `block-02-catalog.html` — кнопка в модалке сертификата
- `block-04-cta.html` — кнопка CTA-блока

---

## 10. SEO — block-00-seo.html

- Вставляется через **Tilda → Настройки страницы → HTML в `<head>`** (не как обычный блок)
- Содержит: `<meta description>`, `<meta og:*>`, `<meta twitter:*>`, `<link rel="canonical">`, JSON-LD Schema.org `Product` + `WebPage`
- Canonical: `https://baristaschool.ru/sertifikat`
- OG-изображение: `https://static.tildacdn.com/tild3361-3830-4334-a262-653461636537/2_copy-min.png`

---

## 11. Деплой

### Vercel (frontend)
```bash
# Через задачу VS Code:
run_task: shell: deploy-barista-prod (workspaceFolder: barista-course)

# Вручную:
/opt/homebrew/bin/vercel --prod --yes --cwd /Users/romansuslin_1/Downloads/All_Code/barista-course/certificates
```

Деплоит `index.html` — standalone-версию. Для Tilda — вручную копировать блоки в интерфейс.

### Бэкенд (server.js)
```bash
# SSH-доступ:
ssh -i $HOME/.ssh/copilot_beget_temp/id_ed25519 root@159.194.202.120

# Деплой server.js:
scp -i $HOME/.ssh/copilot_beget_temp/id_ed25519 server.js root@159.194.202.120:/opt/yclients-dashboard/server.js
# Задача VS Code: deploy-server-fix

# Перезапуск:
pm2 restart yclients-dashboard --update-env
```

### Nginx proxy для публичного API сертификатов
```bash
# Сервер публичного API:
ssh -i $HOME/.ssh/id_ed25519 root@5.35.93.225

# Конфиг:
/etc/nginx/sites-enabled/barista-api

# Проверка после правки:
nginx -t && systemctl reload nginx

# Smoke-check:
curl -Iv --http2 https://api.barista-school.ru/api/public/certificates
curl -sS --http2 https://api.barista-school.ru/api/public/certificates | head -c 500
```

### TLS-настройка fallback host `159-194-202-120.sslip.io`
```bash
# Сервер старого backend/fallback:
ssh -i $HOME/.ssh/copilot_beget_temp/id_ed25519 root@159.194.202.120

# Конфиг:
/etc/nginx/sites-enabled/yclients-dashboard

# Для снижения риска плавающих блокировок из РФ:
ssl_protocols TLSv1.2;

# Проверки:
nginx -t && systemctl reload nginx
openssl s_client -connect 159-194-202-120.sslip.io:443 -servername 159-194-202-120.sslip.io -tls1_3 </dev/null
openssl s_client -connect 159-194-202-120.sslip.io:443 -servername 159-194-202-120.sslip.io -tls1_2 </dev/null
curl -Iv --http2 https://159-194-202-120.sslip.io/api/public/certificates
```

### Конфиг категорий (без деплоя кода)
```bash
# Обновить cert-categories.json на сервере напрямую:
scp -i $HOME/.ssh/copilot_beget_temp/id_ed25519 \
  data/cert-categories.json \
  root@159.194.202.120:/opt/yclients-dashboard/data/cert-categories.json
# Перезапуск НЕ нужен — файл читается при каждом запросе
```

---

## 12. Известные ограничения

### 12.1 Изображения сертификатов не загружаются из YClients API

**Статус:** ❌ Не решено (май 2026)

**Симптом:** В карточках каталога и в модальном окне изображение не отображается — блок скрывается (`display: none`).

**Причина:** YClients Partner API (`/api/v1/company/{id}/loyalty/certificate_types/search`) **не возвращает поле с изображением** в принципе. Полный список полей ответа:
`id, title, company_id, loyalty_group_id, category_id, weight, item_type_id, expiration_type_id, expiration_date, expiration_timeout, expiration_timeout_unit_id, balance_edit_type_id, is_allow_empty_code, is_serial_number_limited, is_archived, date_archived, online_sale_is_enabled, online_sale_title, online_sale_description, online_sale_price, item_type`

Поля `image`, `image_link`, `photo`, `logo` и аналогичные **отсутствуют**. В `online_sale_description` (HTML) тоже нет `<img>` тегов (проверено на всех 34 типах). Изображения видны в YClients admin и в публичном виджете `o3059.yclients.com` — но там JS SPA, который загружает их через внутренний (непубличный) API.

**Где в коде:** `server.js`, строка ~721: `image: c.image || c.image_link || null` → всегда `null`. В `block-02-catalog.html` блок изображения скрывается при `data.image === null`.

**Варианты решения (не реализованы):**
1. Добавить `"defaultImage": "url"` в `cert-categories.json` → отображать иллюстрацию на категорию
2. Создать файл `cert-images.json` с маппингом `typeId → imageUrl` — изображения загрузить вручную на хостинг
3. Headless-парсинг публичного виджета YClients (Puppeteer) — сложно и хрупко

---

## 13. Часто встречающиеся ошибки

| Симптом | Причина | Решение |
|---|---|---|
| Модалка съезжает / не на весь экран | `position:fixed` внутри Tilda-контейнера | Создавать через `createElement` + `body.appendChild` |
| Модалка не анимируется | Нет forced reflow перед сменой opacity | Добавить `el.offsetHeight` между `display='block'` и `opacity='1'` |
| Крестик закрытия овальный | Нет `min-width`/`min-height` на кнопке в flex | Добавить `min-width:32px; min-height:32px; box-sizing:border-box; padding:0` |
| Текст в FAQ прыгает при открытии | Анимируется `padding` снаружи + нет `__inner` | Использовать структуру с `__inner`, `padding-top` только на нём |
| Шрифт Mulish не применяется | block-01 стоит ниже других блоков | Убедиться что block-01-hero.html идёт первым |
| Подчёркивание на кнопке-ссылке | Tilda переопределяет `<a>` | Добавить `text-decoration: none !important` |
| Белый текст на кнопке пропадает | Tilda переопределяет `color` | Добавить `color: #fff !important` |
| `#consalt` не работает | Используется старый якорь `#consalt_sert` | Заменить на `#consalt` везде |
| Каталог временно недоступен у части пользователей | Браузер не достучался до primary и fallback API, свежего localStorage-кеша нет | Проверить `https://api.barista-school.ru/api/public/certificates`, nginx на `5.35.93.225`, затем fallback `https://159-194-202-120.sslip.io/api/public/certificates` |

---

*Версия: июнь 2026. Последнее обновление: primary API сертификатов переведён на `api.barista-school.ru`, `sslip.io` оставлен fallback, добавлен browser cache.*
