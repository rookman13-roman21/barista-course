(function () {
  'use strict';

  var modal = document.getElementById('booking-preview');
  var view = modal && modal.querySelector('[data-booking-view]');
  if (!modal || !view) return;

  var trainers = [
    { id: 'any', name: 'Любой тренер', role: 'Покажем максимум доступных дат', initials: '✓' },
    { id: 'arkady', name: 'Аркадий Скалин', role: 'Тренер', initials: 'АС' },
    { id: 'denis', name: 'Денис Ефремов', role: 'Главный тренер', initials: 'ДЕ' },
    { id: 'nikita', name: 'Никита Баховский', role: 'Тренер', initials: 'НБ' },
    { id: 'sabrina', name: 'Сабрина Темурова', role: 'Тренер', initials: 'СТ' },
    { id: 'roman', name: 'Роман Лунгу', role: 'Старший тренер', initials: 'РЛ' }
  ];
  var lessons = [
    'Ручные методы и основы вкуса',
    'Рецепты и настройка заваривания'
  ];
  var demoSlots = [
    [['26 августа', '10:00'], ['27 августа', '13:30'], ['29 августа', '10:00']],
    [['2 сентября', '10:00'], ['3 сентября', '13:30'], ['5 сентября', '10:00']]
  ];
  var state = {};

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
    });
  }
  function variant() { return state.variant === 'pair' ? 'pair' : 'solo'; }
  function price() { return variant() === 'pair' ? '18 000' : '14 000'; }
  function balance() { return variant() === 'pair' ? '13 000' : '9 000'; }
  function variantLabel() { return variant() === 'pair' ? 'Два участника' : 'Один участник'; }
  function trainerName() { var trainer = trainers.filter(function (item) { return item.id === state.trainer; })[0]; return trainer ? trainer.name : ''; }
  function progress(active) {
    return '<div class="mbs-alt-booking__progress" aria-label="Шаг ' + active + ' из 4">' + [1,2,3,4].map(function (step) {
      return '<span class="' + (step <= active ? 'is-active' : '') + '"></span>';
    }).join('') + '</div>';
  }
  function summary() {
    if (!state.slots || !state.slots.length) return '';
    return '<div class="mbs-alt-summary"><h3>Ваши выбранные занятия</h3><ol>' + state.slots.map(function (slot, index) {
      return '<li><span><b>' + (index + 1) + '. ' + lessons[index] + '</b></span><span>' + escapeHtml(slot.date) + ', ' + escapeHtml(slot.time) + '</span></li>';
    }).join('') + '</ol></div>';
  }
  function navigation(backLabel, nextLabel, disabled) {
    return '<div class="mbs-alt-booking__nav"><button class="mbs-alt-booking__back" type="button" data-preview-back>' + backLabel + '</button><button class="mbs-alt-button mbs-alt-button--primary mbs-alt-booking__next" type="button" data-preview-next' + (disabled ? ' disabled aria-disabled="true" style="opacity:.45;cursor:not-allowed"' : '') + '>' + nextLabel + '</button></div>';
  }
  function renderVariant() {
    view.innerHTML = '<div class="mbs-alt-booking"><span class="mbs-alt-demo-tag">Безопасный local preview</span><h2 id="booking-title">Выберите формат обучения</h2><p class="mbs-alt-booking__intro">Расписание и программа одинаковые. Отличается только стоимость курса.</p>' + progress(1) +
      '<div class="mbs-alt-choice-grid">' +
      '<button class="mbs-alt-choice ' + (variant() === 'solo' ? 'is-selected' : '') + '" type="button" data-preview-variant="solo"><b>Один участник</b><strong>14 000 ₽</strong><small>Индивидуальный темп и всё внимание тренера. Предоплата 5 000 ₽.</small></button>' +
      '<button class="mbs-alt-choice ' + (variant() === 'pair' ? 'is-selected' : '') + '" type="button" data-preview-variant="pair"><b>Два участника</b><strong>18 000 ₽</strong><small>Практика для двоих. Предоплата 5 000 ₽.</small></button>' +
      '</div>' + navigation('Закрыть', 'Продолжить', !state.variant) + '</div>';
  }
  function renderTrainer() {
    view.innerHTML = '<div class="mbs-alt-booking"><p class="mbs-alt-booking__eyebrow">' + variantLabel() + ' · ' + price() + ' ₽</p><h2 id="booking-title">Выберите тренера</h2><p class="mbs-alt-booking__intro">Можно выбрать конкретного тренера или посмотреть максимум свободных дат.</p>' + progress(2) + '<div class="mbs-alt-trainers">' + trainers.map(function (trainer) {
      var selected = state.trainer === trainer.id;
      return '<button class="mbs-alt-trainer ' + (selected ? 'is-selected' : '') + '" type="button" data-preview-trainer="' + trainer.id + '"><span class="mbs-alt-trainer__avatar">' + trainer.initials + '</span><span><b>' + trainer.name + '</b><small>' + trainer.role + '</small></span><span class="mbs-alt-trainer__radio"></span></button>';
    }).join('') + '</div>' + navigation('Назад', 'Выбрать даты', !state.trainer) + '</div>';
  }
  function renderSchedule() {
    var lessonIndex = state.lessonIndex || 0;
    var selected = state.slots[lessonIndex];
    var slots = demoSlots[lessonIndex];
    view.innerHTML = '<div class="mbs-alt-booking"><p class="mbs-alt-booking__eyebrow">' + variantLabel() + ' · ' + escapeHtml(trainerName()) + '</p><h2 id="booking-title">Выберите дату занятия ' + (lessonIndex + 1) + '</h2><p class="mbs-alt-booking__intro">Занятия выбираются по порядку. Это позволяет собрать понятный график всего курса.</p>' + progress(3) +
      '<div class="mbs-alt-schedule-caption"><span><b>Занятие ' + (lessonIndex + 1) + ' из 2</b><small>' + lessons[lessonIndex] + '</small></span><span>3 часа</span></div>' +
      '<div class="mbs-alt-slot-grid">' + slots.map(function (slot, index) {
        var isSelected = selected && selected.date === slot[0] && selected.time === slot[1];
        return '<button class="mbs-alt-slot ' + (isSelected ? 'is-selected' : '') + '" type="button" data-preview-slot="' + index + '"><b>' + slot[0] + '</b><small>' + slot[1] + '</small><em>Демо-слот</em></button>';
      }).join('') + '</div>' + summary() + navigation('Назад', lessonIndex === 1 ? 'Продолжить' : 'Следующее занятие', !selected) + '</div>';
  }
  function renderDetails() {
    view.innerHTML = '<div class="mbs-alt-booking"><p class="mbs-alt-booking__eyebrow">' + variantLabel() + ' · ' + price() + ' ₽</p><h2 id="booking-title">Контактные данные</h2><p class="mbs-alt-booking__intro">Проверьте выбранные даты. В preview данные не отправляются и не сохраняются.</p>' + progress(4) + summary() +
      '<div class="mbs-alt-contact" style="margin-top:18px"><label class="mbs-alt-field"><span>Имя</span><input type="text" placeholder="Ваше имя" autocomplete="off"></label><label class="mbs-alt-field"><span>Телефон</span><input type="tel" placeholder="+7 (999) 000-00-00" autocomplete="off"></label><label class="mbs-alt-field mbs-alt-field--full"><span>Email</span><input type="email" placeholder="name@example.com" autocomplete="off"></label></div>' +
      '<div class="mbs-alt-preview-guard"><span aria-hidden="true">●</span><span><b>Режим preview.</b> Эта форма не подключена к yClients, оплате или API. После кнопки ниже откроется только демонстрация результата.</span></div>' +
      navigation('Назад', 'Посмотреть demo-подтверждение', false) + '</div>';
  }
  function renderConfirmation() {
    view.innerHTML = '<div class="mbs-alt-booking mbs-alt-confirm"><span class="mbs-alt-demo-tag">Только демонстрация</span><div class="mbs-alt-confirm__icon" aria-hidden="true">✓</div><h2 id="booking-title">Вот как будет выглядеть<br>подтверждение</h2><p>В рабочей версии после предоплаты 5 000 ₽ выбранные даты будут закреплены за вами.</p>' + summary() + '<p class="mbs-alt-confirm__notice">В этом local preview бронь, визит и платёж не созданы.</p><div class="mbs-alt-booking__nav"><button class="mbs-alt-booking__back" type="button" data-preview-restart>Начать заново</button><button class="mbs-alt-button mbs-alt-button--primary" type="button" data-booking-close>Закрыть preview</button></div></div>';
  }
  function render() {
    if (state.step === 'trainer') renderTrainer();
    else if (state.step === 'schedule') renderSchedule();
    else if (state.step === 'details') renderDetails();
    else if (state.step === 'confirmation') renderConfirmation();
    else renderVariant();
  }
  function open(preselectedVariant) {
    state = { step: 'variant', variant: preselectedVariant || '', trainer: '', lessonIndex: 0, slots: [] };
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mbs-alt-lock');
    render();
    window.setTimeout(function () { var close = modal.querySelector('[data-booking-close]'); if (close) close.focus(); }, 0);
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mbs-alt-lock');
  }
  function next() {
    if (state.step === 'variant' && state.variant) state.step = 'trainer';
    else if (state.step === 'trainer' && state.trainer) state.step = 'schedule';
    else if (state.step === 'schedule' && state.slots[state.lessonIndex]) {
      if (state.lessonIndex < 1) state.lessonIndex += 1;
      else state.step = 'details';
    } else if (state.step === 'details') state.step = 'confirmation';
    render();
  }
  function back() {
    if (state.step === 'trainer') state.step = 'variant';
    else if (state.step === 'schedule') { if (state.lessonIndex > 0) state.lessonIndex -= 1; else state.step = 'trainer'; }
    else if (state.step === 'details') { state.step = 'schedule'; state.lessonIndex = 1; }
    else close();
    render();
  }

  document.addEventListener('click', function (event) {
    var openButton = event.target.closest('[data-booking-open]');
    if (openButton) { open(openButton.getAttribute('data-variant') || ''); return; }
    if (event.target.closest('[data-booking-close]')) { close(); return; }
    var variantButton = event.target.closest('[data-preview-variant]');
    if (variantButton) { state.variant = variantButton.getAttribute('data-preview-variant'); render(); return; }
    var trainerButton = event.target.closest('[data-preview-trainer]');
    if (trainerButton) { state.trainer = trainerButton.getAttribute('data-preview-trainer'); render(); return; }
    var slotButton = event.target.closest('[data-preview-slot]');
    if (slotButton) { var index = Number(slotButton.getAttribute('data-preview-slot')); var slot = demoSlots[state.lessonIndex][index]; state.slots[state.lessonIndex] = { date: slot[0], time: slot[1] }; render(); return; }
    if (event.target.closest('[data-preview-next]')) { next(); return; }
    if (event.target.closest('[data-preview-back]')) { back(); return; }
    if (event.target.closest('[data-preview-restart]')) { state = { step: 'variant', variant: '', trainer: '', lessonIndex: 0, slots: [] }; render(); }
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && modal.classList.contains('is-open')) close(); });
}());

(function () {
  'use strict';

  document.querySelectorAll('[data-hero-video-play]').forEach(function (button) {
    button.addEventListener('click', function () {
      var media = button.closest('.mbs-alt-hero__media');
      if (!media) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/999634019?autoplay=1&title=0&byline=0&portrait=0&dnt=1';
      iframe.title = 'Курс «Альтернативное заваривание кофе»';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      media.replaceChildren(iframe);
    });
  });

  document.querySelectorAll('.mbs-alt-faq__items').forEach(function (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('details'));

    function closeItem(details) {
      var body = details.querySelector('.mbs-alt-faq__body');
      if (!body || !details.open || details.dataset.busy === '1') return;
      details.dataset.busy = '1';
      body.style.height = body.scrollHeight + 'px';
      body.offsetHeight;
      body.style.height = '0px';
      body.addEventListener('transitionend', function done(event) {
        if (event.propertyName !== 'height') return;
        body.removeEventListener('transitionend', done);
        details.open = false;
        details.dataset.busy = '0';
      });
    }

    function openItem(details) {
      var body = details.querySelector('.mbs-alt-faq__body');
      if (!body || details.open || details.dataset.busy === '1') return;
      items.forEach(function (item) { if (item !== details) closeItem(item); });
      details.dataset.busy = '1';
      details.open = true;
      body.style.height = '0px';
      body.offsetHeight;
      body.style.height = body.scrollHeight + 'px';
      body.addEventListener('transitionend', function done(event) {
        if (event.propertyName !== 'height') return;
        body.removeEventListener('transitionend', done);
        body.style.height = 'auto';
        details.dataset.busy = '0';
      });
    }

    items.forEach(function (details) {
      var body = details.querySelector('.mbs-alt-faq__body');
      var summary = details.querySelector('summary');
      if (!body || !summary) return;
      body.style.height = details.open ? 'auto' : '0px';
      summary.addEventListener('click', function (event) {
        event.preventDefault();
        if (details.open) closeItem(details);
        else openItem(details);
      });
    });
  });
}());

(function () {
  'use strict';

  var photos = Array.prototype.slice.call(document.querySelectorAll('[data-equipment-photo]'));
  var lightbox = document.querySelector('[data-equipment-lightbox]');
  var image = document.querySelector('[data-equipment-lightbox-image]');
  if (!photos.length || !lightbox || !image) return;

  var currentIndex = 0;

  function show(index) {
    currentIndex = (index + photos.length) % photos.length;
    var source = photos[currentIndex].querySelector('img');
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || '';
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mbs-alt-lock');
  }

  photos.forEach(function (photo, index) {
    photo.addEventListener('click', function () {
      show(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('mbs-alt-lock');
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-equipment-close]')).forEach(function (button) {
    button.addEventListener('click', close);
  });
  document.querySelector('[data-equipment-prev]').addEventListener('click', function () { show(currentIndex - 1); });
  document.querySelector('[data-equipment-next]').addEventListener('click', function () { show(currentIndex + 1); });
  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(currentIndex - 1);
    if (event.key === 'ArrowRight') show(currentIndex + 1);
  });
}());

(function () {
  'use strict';

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-program-day]'));
  var number = document.querySelector('[data-program-number]');
  var format = document.querySelector('[data-program-format]');
  var title = document.querySelector('[data-program-title]');
  var description = document.querySelector('[data-program-description]');
  if (!tabs.length || !number || !format || !title || !description) return;

  var days = [
    {
      format: 'Выбор и практика',
      title: 'Выберите методы и зерно под свой интерес',
      description: 'В школе есть V60, кемекс, аэропресс, френч-пресс, джезве и другие способы. Вы сами выбираете, с какими хотите познакомиться, а тренер помогает сравнить большой выбор зерна и вкусов.'
    },
    {
      format: 'Углубление и рецепты',
      title: 'Отработаете выбранные методы глубже',
      description: 'Сфокусируетесь на способах, которые понравились или нужны для дома и кофейни. Будете менять помол, температуру, соотношение кофе и воды, сравнивать чашки и собирать рецепты, которые сможете повторить самостоятельно.'
    }
  ];

  function selectDay(index) {
    var day = days[index];
    if (!day) return;
    number.textContent = 'Занятие ' + (index + 1);
    format.textContent = day.format;
    title.textContent = day.title;
    description.textContent = day.description;
    tabs.forEach(function (tab, tabIndex) {
      var isActive = tabIndex === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectDay(Number(tab.getAttribute('data-program-day'))); });
  });
}());
