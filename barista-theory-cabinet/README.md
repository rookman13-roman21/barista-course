# Теоретическая подготовка к курсу бариста

**Московская школа бариста** — проект для Tilda Members

> **Последнее обновление:** май 2026 (сессия 2)  
> **Активная работа:** кнопка Telegram во всех страницах, исправление тестов, улучшение finish.html ✅

---

## О проекте

Когда клиент вносит предоплату за курс бариста, он получает доступ в личный кабинет Tilda Members.
В этом кабинете ученик заранее проходит теоретическую часть перед очным обучением.

Данный репозиторий содержит HTML/CSS-код всех страниц теоретической подготовки.
Страницы вставляются в Tilda Members через HTML-блок — каждая самодостаточна (всё в одном файле).

---

## Где используется

Страница вставляется в Tilda Members через **HTML-блок** на странице курса «Теоретическая подготовка».

Это означает:
- код самодостаточный (всё в одном блоке)
- нет React, npm, сборки — только HTML + CSS + минимальный JS
- шрифт подключается через Google Fonts
- все стили изолированы внутри `.mbs-theory-page`

---

## Структура проекта

```
barista-theory-cabinet/
  pages/
    barista_theory_home.html          ← Главная страница-навигатор
    barista_theory_intro.html         ← Урок 1: Вступление
    barista_theory_history.html       ← Урок 2: История кофе
    barista_theory_growing.html       ← Урок 3: Выращивание
    barista_theory_roasting.html      ← Урок 4: Обжарка
    barista_theory_finish.html        ← Урок 5: Завершение
    barista_theory_rules.html         ← Доп: Правила школы
    barista_theory_contacts.html      ← Доп: Контакты ✅ финализирован
    barista_theory_exhibitions.html   ← Доп: Кофейные выставки
    barista_theory_tg_channels.html   ← Доп: Telegram-каналы
    barista_theory_coffeeshops.html   ← Доп: Список кофеен

  assets/
    css/theory-base.css
    js/theory.js                      ← только для локальной разработки

  README.md
```

---

## Как собрать итоговый HTML для вставки в Tilda

В файле `pages/barista_theory_home.html` весь нужный код уже готов.

Для вставки в Tilda скопируйте **всё между комментариями**:

```
<!-- НАЧАЛО БЛОКА ДЛЯ TILDA -->
...
<!-- КОНЕЦ БЛОКА ДЛЯ TILDA -->
```

Этот блок включает:
1. `<link>` на Google Fonts
2. `<style>` со всеми стилями
3. HTML-разметку страницы

Тег `<script src="../assets/js/theory.js">` в Tilda **не нужен** — якорный скролл там работает нативно.

---

## Детали: barista_theory_contacts.html ✅

### Секция «Как нас найти» (белый фон)
- Фото входа: Google Drive, `max-width: 400px`, `margin: 0 auto`, `loading="lazy"`
- 🚇 Метро: Бауманская; 🏢 Адрес: Нижняя Красносельская, 35 стр. 50
- Кнопка `.mbs-map-btn` → Яндекс.Карты (hover + на мобиле `width: 100%`, `box-sizing: border-box`)

### Секция «Связаться с нами» (зелёный фон `--mbs-bg-green`)
- **«Соцсети»** (grid 2 кол.): Instagram `@barista_school`, TG-канал `@moscowbaristaschool`
- **«Связаться»** (grid 2×2): Телефон (+ `aria-label`), WhatsApp «Написать», MAX «Написать», TG-чат «Написать»
- Подзаголовки групп: `<h3>` (не `<p>`)

### Что сделано в сессии май 2026
- Убраны эмодзи из заголовков и бейджа
- Удалены дублирующиеся `<link>` Google Fonts
- `loading="lazy"` на фото
- `<p>` → `<h3>` для подзаголовков подгрупп
- Класс `.mbs-map-btn` с hover и мобильной адаптацией
- `aria-label` на карточке телефона

---

## Детали: barista_theory_home.html ✅

### Кнопки и ссылки
- **«Начать обучение»** (hero + финальный CTA) → `vstuplenie-920935975873`
- **«Посмотреть структуру»** → якорь `#learning-path` (плавный скролл)
- **Шаг 1 в маршруте** → `vstuplenie-920935975873`

### JS-скрипт (плавный скролл)
```js
// Плавный скролл по якорям без добавления хэша в URL
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', window.location.pathname);
    }
  });
});

// Если хэш уже есть в URL при загрузке — убрать и встать наверх
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo(0, 0);
}
```

### Что сделано в сессии май 2026 (сессия 1)
- Добавлен плавный скролл на кнопку «Посмотреть структуру»
- Исправлен баг: при обновлении страницы с хэшем в URL браузер прыгал к якорю
- Обновлены ссылки на вступление: `vstuplenie-920935975873` (все 3 вхождения)

---

## Изменения: сессия май 2026 (сессия 2)

### Кнопка «Написать в Telegram» — все страницы ✅

Заменена во всех 5 страницах (`home`, `intro`, `history`, `growing`, `roasting`, `finish`):

| Было | Стало |
|------|-------|
| Ссылка `t.me/Join_MBS_bot?start=c1746815986063-ds` | `https://t.me/Moscow_barista_school` |
| Текст «Написать **боту школы** в Telegram» | «Написать в Telegram» |
| Зелёный стиль (`--mbs-bg-green`, цвет `#417033`) | Синий Telegram-стиль (`#229ED9`, белый текст) |
| SVG с зелёным fill | Стандартная Telegram-иконка, `fill: #fff` |

CSS `.mbs-footer-tg` — новый вид:
```css
background: #229ED9; color: #fff;
padding: 9px 16px; font-size: 13px; font-weight: 800;
```
`:hover` → `background: #1a8bbf`

---

### Тесты: исправление бага «все вопросы раскрыты» ✅

**Причина:** при добавлении `margin-left: auto` к `.mbs-quiz-next` был ошибочно добавлен `display: flex` на `.mbs-quiz-question`, который перезаписывал `display: none`.

**Исправление** в `history.html`, `growing.html`, `roasting.html`:
- Удалены дублирующие правила `display: flex` на `.mbs-quiz-question`
- `flex-direction: column` перенесён в состояние `.active` / `.mbs-quiz-active`

```css
/* history.html */
.mbs-quiz-question { display: none; }
.mbs-quiz-question.active { display: flex; flex-direction: column; }

/* growing.html / roasting.html */
.mbs-quiz-question { display: none; }
.mbs-quiz-question.mbs-quiz-active { display: flex; flex-direction: column; }
```

---

### Кнопка «Следующий вопрос →» — выровнена вправо ✅

Во всех трёх тестах (`history`, `growing`, `roasting`) кнопка прижата к правому краю:
```css
.mbs-quiz-next { margin-left: auto; }
```

---

### barista_theory_finish.html — улучшения ✅

**1. Блок результатов тестов — компактный на мобильном**

На мобильном (`≤600px`) каждый тест отображается одной строкой высотой ~48px:
```
[эмодзи] [название теста]          [счёт] [%]
```
На десктопе — без изменений (три карточки в ряд).

Реализовано через CSS-классы `.mbs-inj-card`, `.mbs-inj-card-left`, `.mbs-inj-card-right`, `.mbs-inj-score`, `.mbs-inj-pct`.

**2. Навигация**

- Убран пустой `<div></div>` (третий элемент flex-контейнера)
- `justify-content: space-between` → `justify-content: flex-start`

**3. Футер**

Добавлена кнопка «Написать в Telegram» (`t.me/Moscow_barista_school`) — синий стиль, как на остальных страницах.

---

## Ссылки на лекции

### Основной маршрут

| № | Урок | Ссылка |
|---|------|--------|
| 1 | Вступление: добро пожаловать на курс бариста | `https://baristaschool.ru/members/courses/education/vstuplenie-920935975873` |
| 2 | История кофе | `https://baristaschool.ru/members/courses/education/istoria-kofe--urok-1-355937582625` |
| 3 | Выращивание кофе | `https://baristaschool.ru/members/courses/education/vyrasivanie--urok-2-123525828298` |
| 4 | Обжарка кофе | `https://baristaschool.ru/members/courses/education/obzarka--urok-3-587024542998` |
| 5 | Завершение теоретической части | `https://baristaschool.ru/members/courses/education/zaversenie-podgotovki-679872355160` |

### Дополнительные материалы

| Раздел | Ссылка |
|--------|--------|
| Правила школы | `https://baristaschool.ru/members/courses/education/pravila-skoly-745732475925` |
| Контакты школы | `https://baristaschool.ru/members/courses/education/kontakty-674473773050` |
| Кофейные выставки | `https://baristaschool.ru/members/courses/education/vystavki-kofejnoj-industrii-810786531739` |
| Полезные Telegram-каналы | `https://baristaschool.ru/members/courses/education/poleznye-telegramkanaly-706282341954` |
| Список кофеен | `https://baristaschool.ru/members/courses/education/spisok-kofeen-rekomendovannyh-mbs-681722421891` |

---

## Фирменные цвета

| Переменная | HEX | Применение |
|------------|-----|------------|
| `--mbs-green-dark` | `#417033` | Основной зелёный (тёмный), CTA-блок фон |
| `--mbs-green` | `#4F883E` | Зелёный средний |
| `--mbs-green-light` | `#B6D8AB` | Зелёный светлый, hover |
| `--mbs-red` | `#CC2841` | Акцент, кнопки, бейдж «Тест» |
| `--mbs-red-soft` | `#D83D54` | Hover для красных кнопок |
| `--mbs-bg-green` | `#E7F2E3` | Зелёный фон секций и карточек |
| `--mbs-pink` | `#EC98A7` | Розовый акцент |
| `--mbs-bg` | `#F5F5F5` | Серый фон страницы |
| `--mbs-bg-pink` | `#F8DDE1` | Розовый фон бейджей «Тест» |
| `--mbs-black` | `#1F1F1F` | Основной текст |
| `--mbs-white` | `#FFFFFF` | Белый |
| `--mbs-gray` | `#666666` | Вторичный текст |
| `--mbs-border` | `rgba(31,31,31,0.10)` | Рамки карточек |

---

## Правила именования классов

Все классы используют префикс **`mbs-`** (Московская Школа Бариста), чтобы не конфликтовать с глобальными стилями Tilda.

Примеры:
- `.mbs-theory-page` — корневой контейнер
- `.mbs-theory-hero` — hero-блок
- `.mbs-step` — шаг маршрута
- `.mbs-badge` / `.mbs-badge-green` — бейджи
- `.mbs-resource-card` — карточка дополнительного материала

**Никаких глобальных стилей** на `body`, `h1`, `p`, `a` и т.д. — только внутри `.mbs-theory-page`.

---

## Как редактировать

### Изменить текст на странице
Откройте `pages/barista_theory_home.html` и найдите нужный блок по комментарию или тексту.

### Изменить ссылку на урок
Найдите нужный `<a class="mbs-step" href="...">` в разделе «Порядок прохождения» и замените `href`.

### Добавить новый урок в маршрут
Скопируйте блок `<a class="mbs-step" ...>...</a>` и вставьте после последнего шага, увеличив номер.

### Добавить карточку в «Дополнительные материалы»
Скопируйте `<a class="mbs-resource-card" ...>...</a>` и добавьте в `.mbs-resources-grid`.  
При добавлении 6-й карточки на десктопе сетка `repeat(5, 1fr)` автоматически перенесёт лишнее на новую строку — при желании поменяйте на `repeat(3, 1fr)`.

### Изменить цвет
Отредактируйте значение переменной в блоке `:root` в `<style>` (или в `assets/css/theory-base.css` для локальной разработки).

---

## Шрифт

**Mulish**, подключён через Google Fonts:
```
weights: 400; 500; 600; 700; 800
```

---

## Адаптив

| Брейкпоинт | Изменения |
|------------|-----------|
| ≤ 1040px | Сетка дополнительных материалов: 5 → 2 колонки |
| ≤ 960px | Hero: 2 колонки → 1 колонка |
| ≤ 720px | Уменьшаются отступы, шрифты, скругления; шаги — 2 колонки; карточки — 1 колонка |
