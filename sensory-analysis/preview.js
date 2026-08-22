(function () {
  'use strict';

  var modal = document.getElementById('booking-preview');
  var view = modal && modal.querySelector('[data-booking-view]');
  if (!modal || !view) return;

  var trainers = [
    { id: 'any', name: 'Любой тренер', note: 'Покажем максимум доступных дат', initials: '✓' },
    { id: 'denis', name: 'Денис Ефремов', note: 'Главный тренер', initials: 'ДЕ' },
    { id: 'roman', name: 'Роман Лунгу', note: 'Старший тренер', initials: 'РЛ' },
    { id: 'sabrina', name: 'Сабрина Темурова', note: 'Тренер', initials: 'СТ' }
  ];
  var lessons = [
    'Основы сенсорики и каппинг',
    'Базовые вкусы и кислотность',
    'Обоняние и методы оценки',
    'Триангуляция и финальная практика'
  ];
  var demoSlots = [
    [['2 сентября', '10:00'], ['3 сентября', '13:30'], ['5 сентября', '10:00']],
    [['9 сентября', '10:00'], ['10 сентября', '13:30'], ['12 сентября', '10:00']],
    [['16 сентября', '10:00'], ['17 сентября', '13:30'], ['19 сентября', '10:00']],
    [['23 сентября', '10:00'], ['24 сентября', '13:30'], ['26 сентября', '10:00']]
  ];
  var state = {};

  function esc(value) {
    return String(value || '').replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }
  function isPair() { return state.variant === 'pair'; }
  function price() { return isPair() ? '35 000' : '25 000'; }
  function variantLabel() { return isPair() ? 'Два участника' : 'Один участник'; }
  function trainerName() {
    var found = trainers.filter(function (item) { return item.id === state.trainer; })[0];
    return found ? found.name : '';
  }
  function progress(active) {
    return '<div class="mbs-ad-booking__progress" aria-label="Шаг ' + active + ' из 4">' + [1, 2, 3, 4].map(function (step) {
      return '<span class="' + (step <= active ? 'is-active' : '') + '"></span>';
    }).join('') + '</div>';
  }
  function nav(back, next, disabled) {
    return '<div class="mbs-ad-booking__nav"><button class="mbs-ad-booking__back" type="button" data-preview-back>' + back + '</button><button class="mbs-ad-button mbs-ad-button--primary mbs-ad-booking__next" type="button" data-preview-next' + (disabled ? ' disabled aria-disabled="true" style="opacity:.45;cursor:not-allowed"' : '') + '>' + next + '</button></div>';
  }
  function summary() {
    if (!state.slots || !state.slots.length) return '';
    return '<div class="mbs-ad-summary"><h3>Ваше расписание</h3><ol>' + state.slots.map(function (slot, index) {
      return '<li><span><b>' + (index + 1) + '. ' + lessons[index] + '</b></span><span>' + esc(slot.date) + ', ' + esc(slot.time) + '</span></li>';
    }).join('') + '</ol></div>';
  }
  function renderVariant() {
    view.innerHTML = '<div class="mbs-ad-booking"><span class="mbs-ad-demo-tag">Безопасный local preview</span><h2 id="booking-title">Выберите формат обучения</h2><p class="mbs-ad-booking__intro">Программа и расписание одинаковые. Отличается только количество участников и стоимость курса.</p>' + progress(1) + '<div class="mbs-ad-choice-grid"><button class="mbs-ad-choice ' + (!isPair() && state.variant ? 'is-selected' : '') + '" type="button" data-preview-variant="solo"><b>Один участник</b><strong>25 000 ₽</strong><small>Индивидуальный темп и всё внимание тренера.</small></button><button class="mbs-ad-choice ' + (isPair() ? 'is-selected' : '') + '" type="button" data-preview-variant="pair"><b>Два участника</b><strong>35 000 ₽</strong><small>Практика для двоих с общим расписанием.</small></button></div>' + nav('Закрыть', 'Продолжить', !state.variant) + '</div>';
  }
  function renderTrainer() {
    view.innerHTML = '<div class="mbs-ad-booking"><p class="mbs-ad-booking__eyebrow">' + variantLabel() + ' · ' + price() + ' ₽</p><h2 id="booking-title">Выберите тренера</h2><p class="mbs-ad-booking__intro">Можно выбрать конкретного тренера или посмотреть максимум доступных дат.</p>' + progress(2) + '<div class="mbs-ad-trainers">' + trainers.map(function (trainer) {
      var selected = state.trainer === trainer.id;
      return '<button class="mbs-ad-trainer ' + (selected ? 'is-selected' : '') + '" type="button" data-preview-trainer="' + trainer.id + '"><span class="mbs-ad-trainer__avatar">' + trainer.initials + '</span><span><b>' + trainer.name + '</b><small>' + trainer.note + '</small></span><span class="mbs-ad-trainer__radio"></span></button>';
    }).join('') + '</div>' + nav('Назад', 'Выбрать даты', !state.trainer) + '</div>';
  }
  function renderSchedule() {
    var index = state.lessonIndex || 0;
    var selected = state.slots[index];
    view.innerHTML = '<div class="mbs-ad-booking"><p class="mbs-ad-booking__eyebrow">' + variantLabel() + ' · ' + esc(trainerName()) + '</p><h2 id="booking-title">Выберите дату занятия ' + (index + 1) + '</h2><p class="mbs-ad-booking__intro">Занятия выбираются последовательно: следующая дата всегда позже предыдущей.</p>' + progress(3) + '<div class="mbs-ad-schedule-caption"><span><b>Занятие ' + (index + 1) + ' из 4</b><small>' + lessons[index] + '</small></span><span>3 часа</span></div><div class="mbs-ad-slot-grid">' + demoSlots[index].map(function (slot, slotIndex) {
      var active = selected && selected.date === slot[0] && selected.time === slot[1];
      return '<button class="mbs-ad-slot ' + (active ? 'is-selected' : '') + '" type="button" data-preview-slot="' + slotIndex + '"><b>' + slot[0] + '</b><small>' + slot[1] + '</small><em>Демо-слот</em></button>';
    }).join('') + '</div>' + summary() + nav('Назад', index === 3 ? 'Проверить расписание' : 'Следующее занятие', !selected) + '</div>';
  }
  function renderConfirmation() {
    view.innerHTML = '<div class="mbs-ad-booking mbs-ad-confirm"><span class="mbs-ad-demo-tag">Только демонстрация</span><div class="mbs-ad-confirm__icon" aria-hidden="true">✓</div><h2 id="booking-title">Расписание собрано</h2><p>В рабочей версии после подтверждения брони откроется следующий шаг записи. В этом preview визит, бронь и платёж не создаются.</p>' + summary() + '<p class="mbs-ad-confirm__notice">Это безопасная локальная демонстрация без подключения к yClients или API.</p><div class="mbs-ad-booking__nav"><button class="mbs-ad-booking__back" type="button" data-preview-restart>Начать заново</button><button class="mbs-ad-button mbs-ad-button--primary" type="button" data-booking-close>Закрыть preview</button></div></div>';
  }
  function render() {
    if (state.step === 'trainer') renderTrainer();
    else if (state.step === 'schedule') renderSchedule();
    else if (state.step === 'confirmation') renderConfirmation();
    else renderVariant();
  }
  function open() {
    state = { step: 'variant', variant: '', trainer: '', lessonIndex: 0, slots: [] };
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mbs-ad-lock');
    render();
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mbs-ad-lock');
  }
  function next() {
    if (state.step === 'variant' && state.variant) state.step = 'trainer';
    else if (state.step === 'trainer' && state.trainer) state.step = 'schedule';
    else if (state.step === 'schedule' && state.slots[state.lessonIndex]) {
      if (state.lessonIndex < 3) state.lessonIndex += 1;
      else state.step = 'confirmation';
    }
    render();
  }
  function back() {
    if (state.step === 'trainer') state.step = 'variant';
    else if (state.step === 'schedule') {
      if (state.lessonIndex) state.lessonIndex -= 1;
      else state.step = 'trainer';
    } else close();
    render();
  }
  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-booking-open]')) { open(); return; }
    if (event.target.closest('[data-booking-close]')) { close(); return; }
    var variant = event.target.closest('[data-preview-variant]');
    if (variant) { state.variant = variant.getAttribute('data-preview-variant'); render(); return; }
    var trainer = event.target.closest('[data-preview-trainer]');
    if (trainer) { state.trainer = trainer.getAttribute('data-preview-trainer'); render(); return; }
    var slot = event.target.closest('[data-preview-slot]');
    if (slot) {
      var selected = demoSlots[state.lessonIndex][Number(slot.getAttribute('data-preview-slot'))];
      state.slots[state.lessonIndex] = { date: selected[0], time: selected[1] };
      render();
      return;
    }
    if (event.target.closest('[data-preview-next]')) { next(); return; }
    if (event.target.closest('[data-preview-back]')) { back(); return; }
    if (event.target.closest('[data-preview-restart]')) open();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}());

/* production-runtime:start */
(function () {
  'use strict';

  var days = [
    { format: 'Вкус и каппинг', title: 'Основы сенсорики', description: 'Разберём, как устроено восприятие вкуса и аромата. Потренируем память на настоях из фруктов, ягод, специй и овощей, проведём классический каппинг и посмотрим, как настои меняют восприятие чашки.' },
    { format: 'Базовые вкусы и кислоты', title: 'Вкус в чистом виде', description: 'Сравним сладкий, солёный, кислый, горький и умами при разной концентрации. Разберём сочетания вкусов, познакомимся с органическими кислотами и увидим их проявление в кофе.' },
    { format: 'Аромат и методика', title: 'Обоняние и сенсорная оценка', description: 'Разберём роль обоняния во вкусовом восприятии и познакомимся с методами сенсорной оценки: каппингом, каптестингом, триангуляцией и сравнительными дегустациями.' },
    { format: 'Итоговая практика', title: 'Триангуляция и выводы', description: 'Освоим слепую дегустацию трёх чашек, научимся аргументированно находить различия и формулировать описание. Подведём итоги курса, ответим на вопросы и вручим сертификаты.' }
  ];
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-program-day]'));
  var number = document.querySelector('[data-program-number]');
  var format = document.querySelector('[data-program-format]');
  var title = document.querySelector('[data-program-title]');
  var description = document.querySelector('[data-program-description]');

  function selectDay(index) {
    var day = days[index];
    if (!day || !number || !format || !title || !description) return;
    number.textContent = 'Занятие ' + (index + 1);
    format.textContent = day.format;
    title.textContent = day.title;
    description.textContent = day.description;
    tabs.forEach(function (tab, tabIndex) {
      var active = tabIndex === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectDay(Number(tab.getAttribute('data-program-day'))); });
  });

  (function initStickyFaqPanel() {
    var ticking = false;
    var desktopQuery = window.matchMedia('(min-width: 821px)');

    function clamp(value, min, max) {
      return Math.max(min, Math.min(value, max));
    }

    function updateStickyPanels() {
      var panels = Array.prototype.slice.call(document.querySelectorAll('[data-mbs-sa-faq-panel]'));
      panels.forEach(function (panel) {
        var section = panel.closest('[data-mbs-sa-faq-section]');
        if (!section || !desktopQuery.matches) {
          panel.style.transform = '';
          return;
        }

        var container = panel.parentElement || section;
        var offset = parseInt(panel.getAttribute('data-mbs-sa-faq-offset') || '90', 10);
        var containerRect = container.getBoundingClientRect();
        var maxShift = Math.max(0, container.offsetHeight - panel.offsetHeight);
        var shift = clamp(offset - containerRect.top, 0, maxShift);
        panel.style.transform = 'translate3d(0,' + shift + 'px,0)';
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateStickyPanels();
        ticking = false;
      });
    }

    window.mbsSaFaqStickyUpdate = updateStickyPanels;
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);
    requestUpdate();
  }());

  document.querySelectorAll('[data-mbs-sa-faq-list]').forEach(function (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.mbs-sa-faq__item'));

    function closeItem(details) {
      var body = details.querySelector('.mbs-sa-faq__body');
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
        if (window.mbsSaFaqStickyUpdate) window.mbsSaFaqStickyUpdate();
      });
    }

    function openItem(details) {
      var body = details.querySelector('.mbs-sa-faq__body');
      if (!body || details.open || details.dataset.busy === '1') return;
      items.forEach(function (item) {
        if (item !== details) closeItem(item);
      });
      details.dataset.busy = '1';
      details.open = true;
      var targetHeight = body.scrollHeight;
      body.style.height = '0px';
      body.offsetHeight;
      body.style.height = targetHeight + 'px';
      body.addEventListener('transitionend', function done(event) {
        if (event.propertyName !== 'height') return;
        body.removeEventListener('transitionend', done);
        body.style.height = 'auto';
        details.dataset.busy = '0';
        if (window.mbsSaFaqStickyUpdate) window.mbsSaFaqStickyUpdate();
      });
    }

    items.forEach(function (details) {
      var body = details.querySelector('.mbs-sa-faq__body');
      var summary = details.querySelector('summary');
      if (!body || !summary) return;
      body.style.height = details.open ? 'auto' : '0px';
      summary.addEventListener('click', function (event) {
        event.preventDefault();
        if (details.open) closeItem(details);
        else openItem(details);
        if (window.mbsSaFaqStickyUpdate) window.mbsSaFaqStickyUpdate();
      });
    });
  });

  var photos = Array.prototype.slice.call(document.querySelectorAll('[data-equipment-photo]'));
  var lightbox = document.querySelector('[data-equipment-lightbox]');
  var image = document.querySelector('[data-equipment-lightbox-image]');
  var current = 0;
  function show(index) {
    current = (index + photos.length) % photos.length;
    var source = photos[current] && photos[current].querySelector('img');
    if (source && image) { image.src = source.currentSrc || source.src; image.alt = source.alt || ''; }
  }
  function closeGallery() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mbs-ad-lock');
  }
  if (photos.length && lightbox && image) {
    if (lightbox.parentNode !== document.body) document.body.appendChild(lightbox);
    photos.forEach(function (photo, index) {
      photo.addEventListener('click', function () {
        show(index);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mbs-ad-lock');
      });
    });
    document.querySelectorAll('[data-equipment-close]').forEach(function (button) { button.addEventListener('click', closeGallery); });
    document.querySelector('[data-equipment-prev]').addEventListener('click', function () { show(current - 1); });
    document.querySelector('[data-equipment-next]').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeGallery(); });
    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }
}());
/* production-runtime:end */
