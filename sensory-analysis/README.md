# Сенсорный анализ кофе — local preview

Локальный пакет новой версии страницы `https://baristaschool.ru/sence`.
Он не создаёт брони, визиты, платежи или обращения к API.

## Запуск

Из корня `barista-course`:

```bash
python3 -m http.server 3216
```

Открыть `http://localhost:3216/sensory-analysis/`.

## Локальная логика

- Курс: 4 занятия по 3 часа.
- Форматы: один участник — 25 000 ₽; два участника — 35 000 ₽.
- Preview демонстрирует маршрут: формат → тренер → четыре последовательные даты → безопасное demo-подтверждение.
- В нём нет `fetch`, URL API, yClients, оплаты или отправки персональных данных.

## Tilda-пакет

Пересобрать блоки:

```bash
node sensory-analysis/scripts/build-tilda-blocks.js
```

Порядок ручной вставки и границы CTA — в [tilda-blocks/README.md](tilda-blocks/README.md).
Публикацию в Tilda выполняет только Роман после независимого review и своего решения «выкладывай».
