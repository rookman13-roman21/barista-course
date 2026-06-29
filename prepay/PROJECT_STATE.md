# PROJECT STATE — prepay (Tilda Zero Block)

> Страница: **baristaschool.ru/prepay**
> Preview: ПКМ на `index.html` → Show Preview (VS Code Live Preview)
> Продакшн: вставить `tilda-block.html` в Tilda Zero Block

---

## Файлы

| Файл | Назначение |
|------|-----------|
| `tilda-block.html` | **Единственный рабочий файл** (~729 строк). Вставляется в Tilda как Zero Block |
| `index.html` | Локальная обёртка для тестирования в браузере |
| `vercel.json` | Конфиг маршрутизации (cleanUrls / trailingSlash) — Vercel не используется |

---

## Структура tilda-block.html (3 блока)

| Блок | CSS-класс | `id` |
|------|-----------|------|
| Hero | `mbs-ph-hero` | — |
| Курсы | `mbs-ph-courses` | `id="courses"` |
| Правила | `mbs-ph-rules` | ~~`id="rools"`~~ **удалён** |

### Важно: скролл по `#rools`

В Hero есть ссылка `<a href="#rools">Читать правила школы →</a>`.
`id="rools"` на секции **намеренно удалён** — браузеру некуда скроллить, Tilda обрабатывает хэш через `hashchange` и открывает попап без прыжка страницы вниз.

---

## Кнопки курсов (Tilda Shop)

Кнопки — нативные `<a>` с `href="#order:..."`, которые Tilda Shop слушает напрямую:

```html
<a class="mbs-ph-courses__card-btn" href="#order:Название курса = 5000:::image=URL">
  Внести →
</a>
```

**`mbsAddToCart` — полностью удалён.** JS-обработчик не нужен.

---

## Курсы (12 карточек)

| `data-category` | Название | `href` для кнопки |
|----------------|----------|-------------------|
| `barista` | Домашний бариста | `#order:Домашний бариста = 5000:::image=https://static.tildacdn.com/tild3734-6134-4566-b936-663038303836/__1.png` |
| `barista` | Бариста за 3 часа | `#order:Курс бариста за 3 часа = 5000:::image=https://static.tildacdn.com/tild3866-6639-4131-b039-303436373130/__1.png` |
| `barista` | Базовый курс бариста | `#order:Базовый курс бариста = 5000:::image=https://static.tildacdn.com/tild6664-3438-4332-b461-316162363833/__1.png` |
| `barista` | Групповой базовый курс | `#order:Групповой базовый курс = 5000:::image=https://static.tildacdn.com/tild3931-6662-4334-b462-353234336666/___1.png` |
| `barista` | Продвинутый курс | `#order:Продвинутый курс = 5000:::image=https://static.tildacdn.com/tild6165-6665-4963-a664-666335626130/Asset_317.png` |
| `barista` | Латте-арт | `#order:Курс Латте-арт = 5000:::image=https://static.tildacdn.com/tild3064-3864-4930-b363-663165346236/-_1.png` |
| `barista` | Профессиональный курс | `#order:Профессиональный курс = 5000:::image=https://static.tildacdn.com/tild6339-3339-4032-b466-373430623464/__1.png` |
| `barista` | Альтернативное заваривание | `#order:Альтернативное заваривание = 5000:::image=https://static.tildacdn.com/tild3339-3765-4633-b233-333063626562/__1.png` |
| `business` | Открытие кофейни | `#order:Открытие кофейни  = 5000:::image=https://static.tildacdn.com/tild6532-3162-4166-a338-663439623663/__1.png` |
| `business` | Погружение для владельцев | `#order:Погружение для владельцев  = 5000:::image=https://static.tildacdn.com/tild3931-3834-4762-b738-346635636337/___1.png` |
| `barista` | Сенсорный анализ кофе | `#order:Сенсорный анализ кофе  = 5000:::image=https://static.tildacdn.com/tild6631-6539-4534-a334-646264383330/__1.png` |
| `barista` | Миксология | `#order:Миксология  = 5000:::image=https://static.tildacdn.com/tild3165-6534-4636-b733-613339613564/photo.png` |

---

## Фильтры

Функция: `mbsFilterCourses(btn, category)`
Категории: `all` / `barista` / `business`

---

## CSS-переменные

```css
--mbs-green-dark: #417033
--mbs-green:      #4F883E
--mbs-green-light:#B6D8AB
--mbs-bg-green:   #E7F2E3
--mbs-red:        #CC2841
--mbs-red-soft:   #D83D54
--mbs-bg:         #F5F5F5
--mbs-black:      #1F1F1F
--mbs-gray:       #555555
```

Шрифт: Mulish (400–900). Иконки: Phosphor Icons.

---

## Как работает Zero Block в Tilda

- Файл вставляется в DOM страницы Tilda напрямую (не iframe)
- Tilda Shop слушает нативные клики `<a href="#order:...">` — JS не нужен
- Tilda обрабатывает `location.hash` через `hashchange` — попапы открываются по `href="#rools"` без `id` на элементе

---

## История ключевых изменений

| Изменение |
|-----------|
| Убран `id="rools"` с `<section class="mbs-ph-rules">` — фикс нежелательного скролла |
| Удалён `mbsAddToCart`, переход на нативные `<a href="#order:...">` |
| Удалены: `tilda-test.html` (устаревший), `blocks/` (пустая папка) |
