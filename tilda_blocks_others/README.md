# Tilda Blocks Others — Barista Course

Отдельные блоки, попапы и hosted-виджеты для вставки на сайт barista-school.ru через Tilda.

## Структура

Каждый файл — самостоятельный HTML-фрагмент:
- встраивается через `Tilda → Zero Block → HTML/JS`
- или деплоится на сервер и подключается через loader/snippet

## Проекты

- `student-discount/` — маленький standalone-блок акции:
  - `tilda-block.html` — самодостаточный HTML/CSS-фрагмент для Tilda;
  - сообщает про скидку 10% школьникам и студентам до 31 августа 2026 года;
  - скидка указана только для индивидуальных курсов бариста;
  - скидка активируется по промокоду `СТУДЕНТ10` при записи и после подтверждения статуса школьника или студента;
  - условия промокода раскрываются в подсказке, а возрастной ориентир `обучаем с 14 лет` показан сразу;
  - блок не содержит JS, backend-запросов, персональных данных, расчёта цен и связей с yClients.

- `trainers-widget/` — универсальный hosted-блок тренеров:
  - Tilda получает короткий loader `tilda-block.html` / `tilda-snippet.html`;
  - актуальная вёрстка подгружается с `https://api.barista-school.ru/api/trainers-widget.html`;
  - данные берутся из `https://api.barista-school.ru/api/trainers.json`;
  - JSON собирает cron в `schedule-online/basic-barista-booking/scripts/update_trainers.py`;
  - yClients управляет видимостью через `specialization` со словом `тренер`, отзывами и описанием `staff.information`;
  - фото, порядок и скрытие управляются через `trainers/overrides.json` на backend-стороне.
