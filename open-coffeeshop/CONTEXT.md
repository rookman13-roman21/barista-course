# База знаний — Курс по открытию кофейни с нуля
**Страница:** `https://baristaschool.ru/open_coffeeshop`
**Проект:** `barista-course/open-coffeeshop/`

---

## 📁 Структура файлов

```
open-coffeeshop/
├── index.html              ← Полная страница (локальное превью через VS Code Live Preview)
├── CONTEXT.md              ← Этот файл — база знаний проекта
└── tilda-blocks/           ← Блоки для вставки в Tilda Zero Block
    ├── block-01-hero.html      ← Hero + шрифты + иконки + JS плавного скролла
    ├── block-02-whofor.html    ← Для кого курс
    ├── block-03-format.html    ← Формат обучения (id="format")
    ├── block-04-trainers.html  ← Ведущие курса
    ├── block-05-result.html    ← Что получите
    ├── block-07-price.html     ← Тарифы (id="price")
    ├── block-08-faq.html       ← FAQ + JS-sticky
    └── block-09-cta.html       ← Финальный CTA
```

> ⚠️ Блок 06 отсутствует — зарезервирован, в текущей версии не используется.

---

## 🎨 Дизайн-система

### Шрифт
- **Mulish** (Google Fonts), веса: 400 / 500 / 600 / 700 / 800 / 900
- Подключается **один раз** в `block-01-hero.html`

### Иконки
- **Phosphor Icons** `@2.1.1` — CDN `unpkg.com`
- Подключается **один раз** в `block-01-hero.html`
- Использование: `<i class="ph ph-{name}"></i>`

### CSS-переменные (`:root`)
```css
--mbs-green-dark:  #417033
--mbs-green:       #4F883E
--mbs-green-light: #B6D8AB
--mbs-bg-green:    #E7F2E3
--mbs-red:         #CC2841
--mbs-bg:          #F5F5F5
--mbs-black:       #1F1F1F
--mbs-gray:        #555555
--mbs-white:       #FFFFFF
```

### Цвета фонов по блокам
| Блок | Фон |
|---|---|
| 01 Hero | `#fff` |
| 02 Для кого | `#E7F2E3` (светло-зелёный) |
| 03 Формат | `#F5F5F5` |
| 04 Ведущие | `#fff` |
| 05 Результаты | `#F5F5F5` |
| 07 Цена | `#fff` |
| 08 FAQ | `#F5F5F5` |
| 09 CTA | `#fff` (карточка внутри — `#E7F2E3`) |

---

## 🔗 Якоря и навигация

| `href` | id на странице | Используется в |
|---|---|---|
| `#format` | `<section id="format">` (блок 03) | Кнопка «Смотреть программу» (hero) |
| `#price` | `<section id="price">` (блок 07) | Кнопки «Смотреть тарифы» (hero, CTA) |
| `#faq` | `<section id="faq">` (блок 08) | Зарезервирован |
| `#consalt` | Попап Tilda (встроенный механизм) | Все кнопки «Оставить заявку» |

### Плавный скролл
- **`index.html`:** `html { scroll-behavior: smooth }` + JS `scrollIntoView`
- **Tilda:** только JS (`position:sticky` / CSS scroll не работает в Tilda)
- Скрипт находится в конце `block-01-hero.html`, вешается на `document` — покрывает все якоря страницы

---

## ⚠️ Правила вставки в Tilda Zero Block

1. **`block-01-hero.html` — всегда ПЕРВЫЙ блок на странице**
   - Содержит `<link>` Mulish и `<script>` Phosphor Icons
   - Содержит `<script>` плавного скролла
   - Остальные блоки этого не дублируют
2. Порядок блоков: **01 → 02 → 03 → 04 → 05 → 07 → 08 → 09**
3. Каждый блок — самодостаточная секция со своими `<style>`
4. CSS-классы изолированы через BEM-префикс `.mbs-*` — конфликтов с Tilda нет

---

## ⚠️ Известные проблемы Tilda и их решения

| Проблема | Решение |
|---|---|
| `position: sticky` не работает | JS-эмуляция через `translateY` + `requestAnimationFrame` (блок 08) |
| Tilda перебивает `color` на ссылках | `color: #fff !important` на всех кнопках |
| Tilda добавляет `text-decoration` | `text-decoration: none !important` на всех кнопках |
| `scroll-behavior: smooth` игнорируется | JS `scrollIntoView({ behavior: 'smooth' })` в блоке 01 |

---

## 💰 Тарифы (блок 07)

| Тариф | Цена | Особенности |
|---|---|---|
| **Старт** | 70 000 ₽ | Акцентная карточка (зелёная), бейдж «Популярный» |
| **Расширенный** | 85 000 ₽ | Обычная карточка, расширенный список включений |

---

## 📋 SEO (index.html)

- **`<title>`:** «Курс по открытию кофейни с нуля — Московская школа бариста»
- **`<meta description>`:** индивидуальный онлайн-курс, 9 часов, финмодель, техкарты, от 70 000 ₽
- **`canonical`:** `https://baristaschool.ru/open_coffeeshop`
- **OG / Twitter Card:** настроены, изображение из Tilda CDN
- **Schema.org:**
  - `Course` — с двумя `Offer` (70k и 85k ₽)
  - `FAQPage` — 8 вопросов из блока FAQ
  - `BreadcrumbList` — Главная → Курсы → Открытие кофейни

---

## 📞 Контакты проекта

| Канал | Ссылка |
|---|---|
| Telegram | `https://t.me/Moscow_barista_school` |
| WhatsApp | `https://wa.me/message/42GZ6YYBJTM5B1` |
| Телефон | `+7 995 999-28-36` |

---

## 🚀 Превью и деплой

### Локальный просмотр
ПКМ на `index.html` → **Show Preview** (VS Code Live Preview)

### Продакшн (Tilda)
Вставить блоки из `tilda-blocks/` в Tilda Zero Block на странице `baristaschool.ru/open_coffeeshop`.

### Git push (основной репо barista-course)
```bash
bash /tmp/git_hb_push.sh
# или задача VS Code: git-push-home-barista
```

---

## 📝 История изменений

| Дата | Что сделано |
|---|---|
| 2026-05 | SEO `<head>` — title, OG, Schema.org Course + FAQ + Breadcrumb |
| 2026-05 | Нарезка на 8 tilda-блоков в `tilda-blocks/` |
| 2026-05 | Добавлен `id="format"` в блок 03 (якорь кнопки «Смотреть программу») |
| 2026-05 | JS-sticky для блока 08 (замена сломанного `position:sticky` в Tilda) |
| 2026-05 | Плавный скролл до якорей (`scroll-behavior` + JS `scrollIntoView`) |
| 2026-05 | Шапки-описания в каждом `block-*.html` (содержание, фон, якоря, классы) |
