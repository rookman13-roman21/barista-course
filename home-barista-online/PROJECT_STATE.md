# 🗂 База знаний — Домашний бариста (home-barista-online)

**Обновлено:** 13 мая 2026  
**Платформа:** Vercel (превью) + Tilda Members (продакшн)

---

## 🚀 Деплой

| Параметр | Значение |
|----------|----------|
| **Vercel URL** | https://home-barista-online.vercel.app |
| **Продакшн URL** | https://baristaschool.ru/home_barista_online |
| **Vercel проект** | `home-barista-online` |
| **Vercel org** | `rookman13-2642s-projects` |
| **Vercel projectId** | `prj_JqcVCu093lChsipMyDgKi6aaQUJb` |
| **Vercel аккаунт** | `baristaschool` |

### Как задеплоить после изменений:
```bash
cd /Users/romansuslin_1/Downloads/All_Code/barista-course/home-barista-online
vercel --prod
```
> Git не используется. Деплой через Vercel CLI напрямую.
> Токен хранится в `~/.vercel/auth.json` после первого `vercel login`.

---

## ⚙️ Принцип работы: два файла

**Правило:** при любом изменении блока редактировать ОБА файла, затем деплоить.

| Задача | Файл-источник (блоки) | Файл Vercel |
|--------|----------------------|-------------|
| Изменить Hero | `pages/blocks/01-hero.html` | `index.html` строки 76–634 |
| Изменить For-whom | `pages/blocks/02-for-whom.html` | `index.html` строки 635–924 |
| Изменить Skills | `pages/blocks/03-skills.html` | `index.html` строки 925–1504 |
| Изменить How-it-works | `pages/blocks/04-how-it-works.html` | `index.html` строки 1505–1660 |
| Изменить Program | `pages/blocks/05-program.html` | `index.html` строки 1661–2021 |
| Изменить Inside | `pages/blocks/07-inside.html` | `index.html` строки 2022–2422 |
| Изменить Price | `pages/blocks/08-price.html` | `index.html` строки 2423–2693 |
| Изменить FAQ | `pages/blocks/09-faq.html` | `index.html` строки 2694–3016 |
| Изменить Final CTA | `pages/blocks/10-final-cta.html` | `index.html` строки 3017–3288 |

---

## 🧱 Блоки страницы (index.html)

| # | div id | Название | Строки | Якорь |
|---|--------|----------|--------|-------|
| 01 | `dev-block-01` | Hero — первый экран | 76–634 | — |
| 02 | `dev-block-02` | Для кого этот курс | 635–924 | — |
| 03 | `dev-block-03` | Что научитесь делать | 925–1504 | — |
| 04 | `dev-block-04` | Как устроен курс | 1505–1660 | — |
| 05 | `dev-block-05` | Программа курса | 1661–2021 | `#program` |
| 07 | `dev-block-07` | Что внутри после покупки | 2022–2422 | — |
| 08 | `dev-block-08` | Цена и покупка | 2423–2693 | `#buy` |
| 09 | `dev-block-09` | FAQ | 2694–3016 | — |
| 10 | `dev-block-10` | Финальный CTA | 3017–3288 | — |

> Блок 06 отсутствует — намеренно пропущен в нумерации.

---

## 🔗 Якоря и CTA-кнопки

| Якорь | Назначение |
|-------|-----------|
| `#program` | Прокрутка к блоку 05 — Программа курса |
| `#buy` | Прокрутка к блоку 08 — Цена и покупка |
| `#consalt` | Открывает форму заявки на Tilda (нативный якорь Tilda) |
| `#order:Онлайн-курс Домашний бариста=3600` | Нативный Tilda-якорь для оплаты (работает только на baristaschool.ru) |

### Кнопки на странице:
- **«Оставить заявку»** → `#consalt` (Hero блок 01, FAQ блок 09)
- **«Смотреть программу»** → `#program` (Hero блок 01)
- **«Купить курс — 3 600 ₽»** → `#order:...` (блок 05 Программа)
- **«Купить курс»** → `#order:...` (блок 08 Цена, блок 10 Финал)

---

## 🎨 Дизайн-система

### CSS-переменные (`:root` в блоке 01):
```css
--mbs-green-dark:  #417033   /* Акцент, тёмный зелёный */
--mbs-green:       #4F883E   /* Зелёный основной */
--mbs-green-light: #B6D8AB
--mbs-red:         #CC2841   /* Красные кнопки */
--mbs-red-soft:    #D83D54   /* Hover */
--mbs-bg-green:    #E7F2E3   /* Зелёный фон */
--mbs-bg:          #F5F5F5   /* Фон страницы */
--mbs-black:       #1F1F1F   /* Основной текст */
--mbs-white:       #FFFFFF
--mbs-gray:        #555555   /* Вторичный текст */
```

### Шрифт: Mulish (Google Fonts), веса 400–900
### Префикс классов: `mbs-` (защита от конфликтов с Tilda)
### Брейкпоинты: 1180px / 820px / 420px

---

## 📺 YouTube ID видео

| Урок | ID |
|------|----|
| Hero промо | `EpktspSQM5I` |
| 1. Вступление | `HffyB_B6pZE` |
| 2. Вода | `m2AFb8pyHbs` |
| 3. Девайсы | `SrwSVWb-8js` |
| 4. Экстракция | `VdGm6H5zF7k` |
| 5. Управление вкусом | `yKpdnHgTNOs` |
| 6. Воронка | `wbx_R6sdkpI` |
| 7. Аэропресс | `7iUdAE_8YUY` |
| 8. Френч-пресс | `uChS-f2DrFQ` |
| 9. В чашке | `Ku6os3gBHIg` |
| 10. Гейзер | `6h2Dce_CJXs` |
| 11. Джезва | `76KJM1ZJxQQ` |

---

## 🎓 Tilda Members — URL уроков

```
Главная: /members/courses/course850647332366/glavnaa-stranica-onlajn-kursa--domasnij-barista-405452433002
Урок 1:  urok-1-vstuplenie-721695319721
Урок 2:  urok-2-voda-i-kofe-843891462773
Урок 3:  urok-3-devajsy-dla-zavarivania-857311863591
Урок 4:  urok-4-metody-ekstrakcii-522574560056
Урок 5:  urok-5-upravlenie-vkusom-702257551880
Урок 6:  urok-6-voronka-119674437952
Урок 7:  urok-7-aeropress-729222555539
Урок 8:  urok-8-frencpress-190343555263
Урок 9:  urok-9-zavarivanie-v-caske-797898181649
Урок 10: urok-10-gejzer-770821488272
Урок 11: urok-11-dzezva-394493952944
```

---

## ✅ Чеклист при изменениях

- [ ] Отредактировал `pages/blocks/NN-name.html`
- [ ] Внёс те же правки в `index.html` (найти блок по `dev-block-NN`)
- [ ] Запустил `vercel --prod`
- [ ] Проверил на https://home-barista-online.vercel.app

---

## 🚫 Что НЕ делать

- **Тёмная тема** — не добавлять (страница в Tilda, нет контроля над остальными блоками)
- **Глобальные CSS без префикса `mbs-`** — конфликт с Tilda
- **Редактировать только blocks/** без `index.html` — Vercel не увидит
- **Редактировать только `index.html`** без blocks/ — блоки для Tilda устареют

---

## Структура файлов

```
home-barista-online/
├── pages/
│   ├── home_barista_online.html          ← Главная страница курса ✅ v2.0
│   └── lessons/
│       ├── _lesson-template.html         ← Шаблон для новых уроков
│       ├── lesson-01-intro.html          ← Урок 1. Вступление
│       ├── lesson-02-water.html          ← Урок 2. Вода и кофе
│       ├── lesson-03-devices.html        ← Урок 3. Девайсы
│       ├── lesson-04-extraction.html     ← Урок 4. Методы экстракции
│       ├── lesson-05-taste-control.html  ← Урок 5. Управление вкусом
│       ├── lesson-06-pourover.html       ← Урок 6. Воронка
│       ├── lesson-07-aeropress.html      ← Урок 7. Аэропресс
│       ├── lesson-08-french-press.html   ← Урок 8. Френч-пресс
│       ├── lesson-09-cup-brewing.html    ← Урок 9. Заваривание в чашке
│       ├── lesson-10-moka-pot.html       ← Урок 10. Гейзер
│       └── lesson-11-cezve.html          ← Урок 11. Джезва
├── assets/
│   ├── css/
│   └── images/
│       ├── hero-preview-opt.jpg          ← сжатое фото для главной (642 КБ)
│       ├── hero-preview.jpg              ← оригинал (5.2 МБ, не использовать)
│       └── moscow barista school logo.svg← логотип (белый, viewBox 0 0 942 179)
├── PROJECT_STATE.md
└── README.md
```

---

## CSS-переменные (единые для всего проекта)

```css
--mbs-green-dark: #417033
--mbs-green:      #4F883E
--mbs-green-light:#B6D8AB
--mbs-red:        #CC2841
--mbs-red-soft:   #D83D54
--mbs-bg-green:   #E7F2E3
--mbs-bg:         #F5F5F5
--mbs-bg-pink:    #F8DDE1
--mbs-black:      #1F1F1F
--mbs-white:      #FFFFFF
--mbs-gray:       #666666
--mbs-border:     rgba(31,31,31,0.10)
```

---

## Главная страница (home_barista_online.html) — v2.0 ✅

### Что реализовано:
- Sticky-шапка с логотипом (SVG inline, по центру, фон --mbs-green-dark)
- Hero: 2 колонки — текст + карточка с фото и статами (10 уроков, ≈ 1 ч 15 мин)
- Горизонтальный timeline «Как проходить курс» (3 шага)
- Программа: 2 модуля, уроки с вертикальной прогресс-линией
- Метки длительности на каждом уроке (≈ N мин)
- Финальный CTA с красной кнопкой
- Подвал с ссылкой на Telegram-чат «Продлёнка»
- Плавный скролл по якорям без хэша в URL
- scroll-margin-top: 56px на якорных секциях

### Изображение Hero:
- Используется YouTube-превью вступительного урока (Урок 1, ID: `HffyB_B6pZE`)
- URL: `https://img.youtube.com/vi/HffyB_B6pZE/maxresdefault.jpg`
- ~~Ссылка на Google Drive удалена~~ (была: `lh3.googleusercontent.com/d/1noTQ3NwCDqUX3Yw6Aq9z9knJyqQr0fUT=s0`)

### Telegram-чат:
- Название: «Продлёнка»
- Ссылка: https://t.me/+0FbQnmyic_Q2NjMy

---

## Страницы уроков — что нужно обновить

**Текущее состояние:** старый дизайн v1.0, CSS-переменные объявлены внутри `.mbs-lesson-page {}` (не в `:root`), нет sticky-шапки.

### Чеклисты «Что понадобится» (уроки 6–11):

| Урок | Оборудование |
|------|--------------|
| 6. Воронка | Кофемолка · Весы+таймер · Воронка (пуровер) · Бумажный фильтр · Кофе 19г · Вода 285мл 92–94°C · Чайник с тонким носиком |
| 7. Аэропресс | Кофемолка · Весы+таймер · Ложка · Аэропресс · Бумажный фильтр · Кофе 15г · Вода 200мл 85–92°C |
| 8. Френч-пресс | Кофемолка · Весы+таймер · Френч-пресс · Кофе 15–18г · Вода 250мл 90–94°C · Ложка |
| 9. В чашке | Кофемолка · Весы · Кружка/стакан · Кофе 10–12г · Вода 150–180мл 90–93°C · Ложка+таймер |
| 10. Гейзер | Кофемолка · Весы · Гейзерная кофеварка · Кофе мелкого помола · Вода · Плита/горелка · Чашка |
| 11. Джезва | Кофемолка · Весы · Джезва · Кофе 7–9г · Вода 80–100мл · Плита/горелка · Ложка · Маленькая чашка |

### URL-навигация между уроками (Tilda Members):

```
Главная:   /members/courses/course850647332366/glavnaa-stranica-onlajn-kursa--domasnij-barista-405452433002
Урок 1:    /members/courses/course850647332366/urok-1-vstuplenie-721695319721
Урок 2:    /members/courses/course850647332366/urok-2-voda-i-kofe-843891462773
Урок 3:    /members/courses/course850647332366/urok-3-devajsy-dla-zavarivania-857311863591
Урок 4:    /members/courses/course850647332366/urok-4-metody-ekstrakcii-522574560056
Урок 5:    /members/courses/course850647332366/urok-5-upravlenie-vkusom-702257551880
Урок 6:    /members/courses/course850647332366/urok-6-voronka-119674437952
Урок 7:    /members/courses/course850647332366/urok-7-aeropress-729222555539
Урок 8:    /members/courses/course850647332366/urok-8-frencpress-190343555263
Урок 9:    /members/courses/course850647332366/urok-9-zavarivanie-v-caske-797898181649
Урок 10:   /members/courses/course850647332366/urok-10-gejzer-770821488272
Урок 11:   /members/courses/course850647332366/urok-11-dzezva-394493952944
```

---

## Шрифт

Google Fonts Mulish: 400;500;600;700;800  
`https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&display=swap`
