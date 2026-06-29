# barista-interview — Состояние проекта

## Назначение
Лендинг «Собеседование бариста» — B2B-услуга MBS.
Публичный URL: `baristaschool.ru/hr`

## Стек
- Чистый HTML/CSS (без фреймворков)
- Google Fonts: Mulish
- Phosphor Icons (CDN: unpkg.com)
- Превью: VS Code Live Preview (ПКМ на index.html → Show Preview)

## Файлы
| Файл | Описание |
|------|----------|
| `index.html` | Основной файл лендинга (1311 строк) |
| `vercel.json` | Конфиг маршрутизации (cleanUrls / trailingSlash) — Vercel не используется |

## Структура страницы
1. **Hero** — заголовок + подзаголовок + CTA-кнопка
2. **Что включает** — список услуг
3. **Для кого** — целевая аудитория
4. **Тарифы** — 3 варианта:
   - Онлайн — 1 500 ₽
   - Практика — 3 000 ₽ (featured)
   - Шеф-бариста — 5 000 ₽
5. **FAQ** — раскрывается через `<details>` + JS-анимация
6. **CTA** — финальная форма заявки (`href="#consalt"`)

## SEO
- Полные мета-теги + OG + Twitter Card
- Schema.org: `Service`, `BreadcrumbList`, `FAQPage`

## Заметки
- Изображение hero берётся с Tilda CDN: `static.tildacdn.com`
- Файл `_tilda_raw.html` удалён (был старый дамп с Tilda, использовался как референс при написании index.html)

## История деплоя
- Проект создан с нуля на основе Tilda-референса
- Страница готова; продакшн — вставка `index.html` в Tilda
