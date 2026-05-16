# Домашний бариста — Онлайн-курс
## Московская школа бариста | baristaschool.ru

---

## О проекте

HTML-страницы для онлайн-курса «Домашний бариста» Московской школы бариста.
Страницы вставляются в Tilda через HTML-блок и подключаются в Tilda Members как лекции.

**Главная страница курса:** https://baristaschool.ru/members/courses/course850647332366/glavnaa-stranica-onlajn-kursa--domasnij-barista-405452433002

---

## Структура файлов

```
home-barista-online/
├── pages/
│   ├── home_barista_online.html          ← Главная страница курса
│   └── lessons/
│       ├── _lesson-template.html         ← Шаблон для новых уроков
│       ├── lesson-01-intro.html          ← Урок 1. Вступление
│       ├── lesson-02-water.html          ← Урок 2. Вода и кофе
│       ├── lesson-03-devices.html        ← Урок 3. Девайсы
│       ├── lesson-04-extraction.html     ← Урок 4. Экстракция
│       ├── lesson-05-taste-control.html  ← Урок 5. Управление вкусом
│       ├── lesson-06-pourover.html       ← Урок 6. Воронка
│       ├── lesson-07-aeropress.html      ← Урок 7. Аэропресс
│       ├── lesson-08-french-press.html   ← Урок 8. Френч-пресс
│       ├── lesson-09-cup-brewing.html    ← Урок 9. Заваривание в чашке
│       ├── lesson-10-moka-pot.html       ← Урок 10. Гейзер
│       └── lesson-11-cezve.html          ← Урок 11. Джезва
├── assets/
│   ├── css/    ← (резерв для общих стилей)
│   └── images/ ← (изображения)
├── PROJECT_STATE.md
└── README.md
```

---

## Программа курса

### Модуль 1. База домашнего заваривания
| № | Файл | YouTube ID | Длительность |
|---|------|------------|-------------|
| 1 | lesson-01-intro.html | HffyB_B6pZE | ≈ 1 мин |
| 2 | lesson-02-water.html | m2AFb8pyHbs | ≈ 2 мин |
| 3 | lesson-03-devices.html | SrwSVWb-8js | ≈ 5 мин |
| 4 | lesson-04-extraction.html | VdGm6H5zF7k | ≈ 2 мин |
| 5 | lesson-05-taste-control.html | yKpdnHgTNOs | ≈ 4 мин |

### Модуль 2. Практика заваривания
| № | Файл | YouTube ID | Длительность |
|---|------|------------|-------------|
| 6 | lesson-06-pourover.html | wbx_R6sdkpI | ≈ 12 мин |
| 7 | lesson-07-aeropress.html | 7iUdAE_8YUY | ≈ 16 мин |
| 8 | lesson-08-french-press.html | uChS-f2DrFQ | ≈ 10 мин |
| 9 | lesson-09-cup-brewing.html | Ku6os3gBHIg | ≈ 7 мин |
| 10 | lesson-10-moka-pot.html | 6h2Dce_CJXs | ≈ 7 мин |
| 11 | lesson-11-cezve.html | 76KJM1ZJxQQ | ≈ 8 мин |

---

## Как использовать шаблон для нового урока

1. Скопируйте файл `pages/lessons/_lesson-template.html`
2. Переименуйте по схеме `lesson-NN-НАЗВАНИЕ.html` (например `lesson-12-chemex.html`)
3. Замените все значения `[В_СКОБКАХ]` на реальные данные
4. Вставьте полный HTML-код в HTML-блок Tilda

---

## Фирменные цвета

| Переменная | HEX | Применение |
|-----------|-----|-----------|
| `--mbs-green-dark` | `#417033` | Акцент, тёмный зелёный |
| `--mbs-green` | `#4F883E` | Зелёный основной |
| `--mbs-green-light` | `#B6D8AB` | Светло-зелёный |
| `--mbs-red` | `#CC2841` | Кнопки, номера уроков |
| `--mbs-red-soft` | `#D83D54` | Hover для красных кнопок |
| `--mbs-bg-green` | `#E7F2E3` | Зелёный фон блоков |
| `--mbs-bg` | `#F5F5F5` | Фон страницы |
| `--mbs-bg-pink` | `#F8DDE1` | Розовый фон |

---

## CSS-классы (система именования)

Все классы используют префикс **`mbs-`** во избежание конфликтов с Tilda.

### Главная страница (`.mbs-course-page`)
- `.mbs-course-container` — контейнер
- `.mbs-course-hero` — hero-блок
- `.mbs-section` / `.mbs-section-green` — секции
- `.mbs-module` — блок модуля
- `.mbs-lesson` — карточка урока
- `.mbs-final` — финальный CTA

### Страница урока (`.mbs-lesson-page`)
- `.mbs-lp-container` — контейнер
- `.mbs-lp-header` — шапка урока
- `.mbs-lp-video-wrap` / `.mbs-lp-video-frame` — видео
- `.mbs-lp-section` / `.mbs-lp-section-green` — секции
- `.mbs-lp-list` — список "Что разберём"
- `.mbs-lp-tips` — список советов
- `.mbs-lp-nav` — навигация между уроками
- `.mbs-lp-cta` — финальный CTA

---

## Технические требования

- ✅ Самодостаточный HTML + CSS в одном файле
- ✅ Без внешних зависимостей (кроме Google Fonts)
- ✅ Без конфликтов с Tilda (префикс `mbs-`, нет глобальных стилей)
- ✅ Адаптив: 1120px / 960px / 640px
- ✅ Шрифт: Mulish (Google Fonts)
- ✅ CSS-переменные
- ✅ YouTube через embed: `https://www.youtube.com/embed/VIDEO_ID`
- ✅ Нет JS (если не нужен)
