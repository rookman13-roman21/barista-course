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

- `partners-catalog/` — публичный каталог партнёров для `https://baristaschool.ru/all-partners`:
  - в Tilda один раз вставляется короткий loader `tilda-loader.html`;
  - актуальная вёрстка грузится с hosted HTML `https://api.barista-school.ru/api/partners-catalog.html`;
  - `hosted-partners-catalog.html` — исходник hosted HTML для деплоя в `/var/www/html/api/partners-catalog.html`;
  - `partners-catalog.html` — локальный прототип с поиском, категориями и подробными карточками;
  - данные берутся из публичного JSON `https://api.barista-school.ru/api/partners.json`;
  - изображения категорий отдаются с `https://api.barista-school.ru/partners-catalog/assets/categories/...`;
  - read-only JSON собирает `bitrix-tools/scripts/export_public_partners.py` из компаний Битрикс `COMPANY_TYPE=PARTNER`;
  - в Битрикс используются три публичных поля: разрешение публикации, описание партнёра и чем он полезен при открытии кофейни;
  - в публичный JSON нельзя отдавать телефоны, CRM-email, внутренние условия, Drive/Bitrix-ссылки, служебные ID и `UF_CRM_*` ключи напрямую;
  - `/all-partners` показывает категории, `/all-partners?category=...` показывает список компаний выбранной категории без сетки категорий;
  - поиск на странице категории ищет внутри категории и не сбрасывает пользователя обратно ко всем категориям;
  - локальный `mock/partners.json` нужен только для прототипа и проверки интерфейса.

- `capping/` — оценочные листы каппинга:
  - `cupping-score-sheet-loader.html` + `cupping-score-sheet.html` — оценочный лист из личного кабинета;
  - `public-cupping-score-sheet-loader.html` + `public-cupping-score-sheet.html` — публичный оценочный лист каппинга;
  - страница Tilda: `https://baristaschool.ru/capping_list`;
  - в Tilda вставляется только loader `public-cupping-score-sheet-loader.html`;
  - loader загружает hosted HTML `https://api.barista-school.ru/api/public-cupping-score-sheet.html`;
  - рабочий файл фрагмента: `public-cupping-score-sheet.html`;
  - серверный путь фрагмента: `/var/www/html/api/public-cupping-score-sheet.html`;
  - лист работает без личного кабинета, `cupping_id`, Bearer token и серверной отправки данных;
  - данные сохраняются только в браузере в `localStorage` ключ `mbs-public-cupping-score-sheet-v2`;
  - по умолчанию есть 6 лотов, их можно переименовать, добавить и удалить;
  - в анкете есть имя, телефон, название каппинга и 4 вопроса про опыт;
  - в итогах есть копирование результата для мессенджера, печать/PDF и CSV;
  - кнопка `Как заполнять` открывает попап-инструкцию для новичка;
  - JSON-кнопку и технические надписи для пользователя не возвращать;
  - этот лист не связан с опубликованными итогами фотоальбомов на `/capping`.
