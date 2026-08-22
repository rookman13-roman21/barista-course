# Профессиональный курс бариста

Исходники обновления существующей страницы `/expert`. Local preview нужен для
визуальной проверки и не создаёт визитов, броней или платежей.

## Статус выпуска

- C-review Claude пройден 22.08.2026.
- Tilda-пакет: commit `60c8874` в `barista-course/main`.
- Конфиг online-записи: commit `acf7910` в `schedule-online/main`.
- Production-конфиг и cron уже развернуты; public slots JSON и safe
  `check_only` для одного и двух участников подтверждены.
- Tilda ещё не менялась: Роман вручную вставляет блоки из `tilda-blocks/`,
  затем подтверждает результат на опубликованной странице.

## Запуск

Из корня `barista-course`:

```bash
python3 -m http.server 3216
```

Открыть `http://localhost:3216/professional-barista/`.

## Граница preview

- `preview.js` не содержит `fetch`, URL booking API, yClients, оплату или
  отправку формы;
- кнопка «Записаться онлайн» открывает только демонстрационный wizard;
- CTA «Оставить заявку» использует штатный `href="#consalt"`; локальный сервер
  не открывает Tilda popup.

## Tilda-пакет

Порядок вставки и границы CTA описаны в
[`tilda-blocks/README.md`](tilda-blocks/README.md). Блоки пересобираются из
корня `barista-course` командой:

```bash
node professional-barista/scripts/build-tilda-blocks.js
```

После ручной публикации нужна проверка на `/expert`: popup онлайн-записи,
`#consalt` для заявок и отдельные контакты Telegram, WhatsApp и телефона.
