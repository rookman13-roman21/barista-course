# Data Contract — Trainers Widget

## Trainers Public JSON

Публичный файл:

```text
https://api.barista-school.ru/api/trainers.json
```

Формат:

```json
{
  "updated_at": "2026-05-26T21:30:00+03:00",
  "trainers": [
    {
      "staff_id": 3915755,
      "name": "Сабрина Темурова",
      "position": "Тренер MBS",
      "specialization": "тренер",
      "photo": "https://static.tildacdn.com/...",
      "bio": "Короткое описание тренера",
      "rating": 5,
      "reviews_count": 18,
      "reviews": [
        {
          "author": "Анна",
          "date": "2026-05-20",
          "rating": 5,
          "text": "Текст отзыва..."
        }
      ]
    }
  ]
}
```

## Overrides JSON

Хранится на стороне backend/cron и не обязан быть публичным.

```json
{
  "3915755": {
    "photo": "https://static.tildacdn.com/...",
    "order": 30,
    "bio": "Короткое описание тренера для попапа",
    "hidden": false
  }
}
```

## Advisors Public JSON

Публичный файл:

```text
https://api.barista-school.ru/api/advisors.json
```

Формат:

```json
{
  "updated_at": "2026-06-18T23:40:49+03:00",
  "advisors": [
    {
      "staff_id": 1322544,
      "name": "Роман Суслин",
      "position": "Основатель школы",
      "photo": "https://static.tildacdn.com/...",
      "bio": "Описание из yClients staff.information"
    }
  ]
}
```

Правила:

- источник сотрудников: `GET /company/{companyId}/staff/`;
- фильтровать сотрудников по `position.title`, где значение строго равно `Основатель школы` или `Управляющий`;
- не использовать поле `specialization` для отбора наставников;
- брать описание из `staff.information` в yClients, очищая HTML-разметку;
- брать фото только из backend-списка ручных фото по имени сотрудника;
- не отдавать `reviews`, `reviews_count`, `rating`, клиентские данные, телефоны, email, записи и внутренние технические поля yClients.

## Backend сборка

Источник сотрудников:

```text
GET /company/{companyId}/staff/
```

Источник отзывов:

```text
GET /comments/{companyId}
```

Правила:

- фильтровать сотрудников по `specialization`, где значение содержит `тренер` без учёта регистра;
- брать описание тренера из `staff.information` в yClients, очищая HTML-разметку;
- игнорировать `avatar` и другие фото из yClients;
- брать фото только из overrides по `staff_id`;
- если фото нет, отдавать пустую строку, frontend покажет placeholder;
- группировать отзывы по `staff_id`;
- в текущем ответе yClients `/comments/{companyId}` ID сотрудника приходит в поле `master_id`;
- по умолчанию собирать расширенный период отзывов (`TRAINERS_REVIEWS_LOOKBACK_DAYS`, сейчас 2000 дней);
- не отдавать в публичный JSON пустые отзывы и короткие отзывы меньше `TRAINERS_MIN_REVIEW_WORDS` слов, сейчас 4 слова;
- в публичный JSON отдавать все содержательные отзывы за выбранный период, чтобы в попапе можно было раскрыть полный список;
- в интерфейсе сначала показывать 2-3 последних отзыва, остальные раскрывать по кнопке;
- `reviews_count` считать по содержательным отзывам, которые реально попали в публичный JSON;
- `rating` брать из yClients staff rating или считать среднее по отзывам, если staff rating отсутствует.

## Privacy

В публичный JSON нельзя отдавать:

- телефоны клиентов;
- email клиентов;
- ID клиентов;
- внутренние комментарии записей;
- технические поля yClients, не нужные для сайта.

Для `advisors.json` дополнительно нельзя отдавать отзывы, рейтинг и данные записей. Сейчас публичный состав полей ограничен `updated_at`, `staff_id`, `name`, `position`, `photo`, `bio`.

## Frontend fallback

Tilda-блок должен:

- показать ошибку загрузки, если JSON недоступен;
- показать `Пока нет отзывов`, если у тренера нет отзывов;
- показать placeholder, если нет фото;
- не ломать страницу, если у части тренеров нет необязательных полей.
