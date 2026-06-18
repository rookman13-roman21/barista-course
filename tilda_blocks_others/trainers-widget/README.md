# Trainers Widget — универсальный блок тренеров

Самостоятельные Tilda-блоки для вывода тренеров и наставников Московской школы бариста.

Цель проекта: показывать на сайте актуальные списки сотрудников из yClients без ручного редактирования HTML. Tilda-блоки не обращаются в yClients напрямую и не содержат токены. Они читают публичные JSON, которые собираются защищённым backend/cron-процессом.

## Файлы

- `tilda-block.html` — короткий loader-сниппет для вставки в Tilda один раз.
- `tilda-snippet.html` — тот же loader-сниппет без длинного комментария.
- `trainers-widget.html` — актуальная hosted-версия блока: HTML/CSS/JS, которую loader подгружает с сервера.
- `trainers-widget.js` — стабильный loader, который загружает `trainers-widget.html` и запускает скрипты внутри него.
- `advisors-widget.html` — отдельный самодостаточный Tilda-блок наставников: HTML/CSS/JS в одном файле, читает `advisors.json`.
- `DATA_CONTRACT.md` — контракт публичного JSON и правила сборки из yClients.
- `overrides.example.json` — пример ручных правок по `staff_id`: фото, порядок, био, скрытие.
- `mock/trainers.json` — тестовый JSON для локальной проверки структуры данных.

## Архитектура

```text
yClients
  → backend/cron с токенами
  → публичный JSON https://api.barista-school.ru/api/trainers.json
  → публичный JSON https://api.barista-school.ru/api/advisors.json
  → hosted widget https://api.barista-school.ru/api/trainers-widget.html
  → loader в Tilda
```

Текущий backend-генератор находится в соседнем проекте:

```text
/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking/scripts/update_trainers.py
```

Ручные фото, порядок, био и скрытие тренеров:

```text
/Users/Romka/Downloads/All_Code/schedule-online/basic-barista-booking/trainers/overrides.json
```

## Источники данных

Из yClients:

- имя и фамилия сотрудника;
- должность;
- специализация;
- рейтинг;
- отзывы.

Из ручного overrides JSON:

- фото тренера;
- порядок вывода;
- короткое био;
- флаг скрытия.

Фото из yClients не используем: они мелкие и плохого качества.

## Правило показа наставников

Отдельный блок `advisors-widget.html` показывает сотрудников из публичного JSON:

```text
https://api.barista-school.ru/api/advisors.json
```

Сотрудник попадает в `advisors.json`, если:

- не уволен в yClients;
- в поле yClients `Должность` (`position.title`) указано строго `Основатель школы` или `Управляющий`.

Для наставников не подтягиваются отзывы, рейтинг, клиентские данные и записи. Описание берётся из `staff.information` в yClients, фото задаются вручную в backend-генераторе по имени сотрудника.

## Правило показа тренеров

Сотрудник попадает в публичный JSON, если:

- не скрыт в overrides;
- в поле `specialization` есть слово `тренер` без учёта регистра.

Если у сотрудника в yClients убрать слово `тренер` из специализации, после следующего запуска cron карточка исчезнет из `trainers.json` и с сайта. Если специализацию вернуть, карточка появится снова при следующей генерации.

Новые отзывы подтягиваются из yClients через `GET /comments/{companyId}` и привязываются к сотруднику по `master_id`. После следующего запуска cron новый содержательный отзыв появляется в публичном JSON и в попапе тренера.

Отзывы фильтруются на стороне backend:

- период задаётся `TRAINERS_REVIEWS_LOOKBACK_DAYS`, сейчас используется расширенный период 2000 дней;
- пустые отзывы не публикуются;
- короткие отзывы меньше `TRAINERS_MIN_REVIEW_WORDS` слов, сейчас 4 слова, не публикуются;
- `reviews_count` показывает количество содержательных отзывов, которые реально можно открыть в карточке.

## Подключение в Tilda

Вставить содержимое `tilda-block.html` в HTML-блок Tilda один раз.

После этого Tilda-код не нужно обновлять при правках дизайна. Loader будет сам подгружать актуальную hosted-версию:

```text
https://api.barista-school.ru/api/trainers-widget.html
```

Данные тренеров читаются из:

```text
https://api.barista-school.ru/api/trainers.json
```

## Обновление дизайна

Править:

```text
trainers-widget.html
```

После правки загрузить на сервер:

```bash
scp trainers-widget.html root@5.35.93.225:/var/www/html/api/trainers-widget.html
```

Loader запрашивает HTML с cache-buster, поэтому изменения вёрстки и дизайна подтягиваются без повторной вставки кода в Tilda.

Если меняется сам loader, загрузить:

```bash
scp trainers-widget.js root@5.35.93.225:/var/www/html/trainers-widget.js
```

Обычно loader менять не нужно.

## Безопасность

- Не вставлять yClients-токены в Tilda-блок.
- Не публиковать телефоны, email и другие персональные данные клиентов в JSON.
- Отзывы в публичном JSON должны содержать только имя автора, дату, рейтинг и текст отзыва.
- `advisors.json` не должен содержать отзывы, рейтинг, телефоны, email, клиентские ID, записи, внутренние комментарии или технические поля yClients.
- Frontend-блоки должны читать только публичные JSON на `api.barista-school.ru`, а не yClients API напрямую.
