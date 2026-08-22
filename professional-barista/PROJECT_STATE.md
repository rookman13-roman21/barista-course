# Профессиональный курс бариста

- Статус: server-контур выпущен, Tilda ожидает ручной вставки и приёмки.
- Исходная Tilda-страница: `20820231`, публичный путь `/expert`.
- Исходник получен через Tilda API 22.08.2026 в read-only режиме.
- Формат страницы: 5 последовательных занятий по 3 часа.
- Цена: один участник — 32 000 ₽, два участника — 39 000 ₽.
- Предоплата: 5 000 ₽.

## Выпущено 22.08.2026

- Независимый C-review Claude пройден в `review-exchange/0091`.
- Tilda-пакет закоммичен и запушен: `barista-course` `60c8874`.
- Конфиг manager-flow и общий cron закоммичены и запушены:
  `schedule-online` `acf7910`.
- На production создан `courses/professional-barista.json`, cron включает
  slug, public `/api/courses/professional-barista/slots.json` отвечает `200`.
- Safe `check_only` подтверждён для solo и pair; визиты и платежи не
  создавались.

## Открытая приёмка

Tilda не публиковалась автоматически. После ручной замены HTML-блоков Роман
проверяет опубликованную `/expert`: открытие online booking, штатный popup
Tilda по `#consalt` и отдельные ссылки Telegram, WhatsApp и телефона.
