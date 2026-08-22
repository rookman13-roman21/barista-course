(function () {
  'use strict';

  var modal = document.querySelector('[data-preview-modal]');
  if (!modal) return;
  var title = modal.querySelector('[data-preview-title]');
  var lead = modal.querySelector('[data-preview-lead]');
  var summary = modal.querySelector('[data-preview-summary]');
  var next = modal.querySelector('[data-preview-next]');
  var selectedVariant = '';

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mbs-la-lock');
  }

  function openModal() {
    selectedVariant = '';
    title.textContent = 'Выберите формат';
    lead.textContent = 'В Tilda здесь откроется настоящий виджет онлайн-записи.';
    modal.querySelector('[data-preview-choices]').hidden = false;
    summary.hidden = true;
    next.hidden = true;
    modal.querySelectorAll('[data-preview-variant]').forEach(function (button) { button.classList.remove('is-selected'); });
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mbs-la-lock');
  }

  document.querySelectorAll('[data-booking-open]').forEach(function (button) {
    button.addEventListener('click', openModal);
  });
  modal.querySelectorAll('[data-preview-close]').forEach(function (button) {
    button.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  modal.querySelectorAll('[data-preview-variant]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectedVariant = button.getAttribute('data-preview-variant');
      modal.querySelectorAll('[data-preview-variant]').forEach(function (item) { item.classList.toggle('is-selected', item === button); });
      title.textContent = 'Дальше — тренер и даты';
      lead.textContent = 'Настоящий виджет покажет свободное время для трёх занятий и не даст выбрать даты в обратном порядке.';
      summary.hidden = false;
      summary.textContent = selectedVariant === 'pair'
        ? 'Два участника · 32 000 ₽ · предоплата 5 000 ₽'
        : 'Один участник · 24 000 ₽ · предоплата 5 000 ₽';
      next.hidden = false;
    });
  });
  next.addEventListener('click', function () {
    title.textContent = 'Демонстрация завершена';
    lead.textContent = 'Локальное preview не подключено к yClients и не создаёт записи. В Tilda этот шаг ведёт к форме контактов и предоплате.';
    modal.querySelector('[data-preview-choices]').hidden = true;
    summary.hidden = false;
    summary.textContent = 'Выбран формат: ' + (selectedVariant === 'pair' ? 'два участника' : 'один участник') + '.';
    next.hidden = true;
  });
}());

(function () {
  'use strict';

  document.querySelectorAll('[data-hero-video-play]').forEach(function (button) {
    button.addEventListener('click', function () {
      var media = button.closest('.mbs-la-hero__media');
      if (!media) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/999633455?autoplay=1&title=0&byline=0&portrait=0&dnt=1';
      iframe.title = 'Курс «Латте-арт»';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      media.replaceChildren(iframe);
    });
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

  var lessons = [
    {
      format: 'Основа техники',
      title: 'Поймёте текстуру молока и базовое вливание',
      description: 'Разберёте, как эспрессо, температура и текстура молока влияют на рисунок. Отработаете базовую стойку, положение питчера и вливание, чтобы получить чистое сердце.'
    },
    {
      format: 'Форма и контраст',
      title: 'Соберёте тюльпан и научитесь управлять потоком',
      description: 'Закрепите базу, отработаете высоту, скорость и траекторию вливания. Поймёте, почему рисунок теряет форму, и научитесь собирать более сложный тюльпан.'
    },
    {
      format: 'Повторение в сервисе',
      title: 'Увереннее нарисуете розетту и свой рисунок',
      description: 'Соединим движения в целый рисунок, уделим внимание чистоте чашки и повторяемости. Тренер поможет выбрать следующий шаг для самостоятельной практики.'
    }
  ];

  function selectLesson(index) {
    var lesson = lessons[index];
    if (!lesson) return;
    number.textContent = 'Занятие ' + (index + 1);
    format.textContent = lesson.format;
    title.textContent = lesson.title;
    description.textContent = lesson.description;
    tabs.forEach(function (tab, tabIndex) {
      var active = tabIndex === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectLesson(Number(tab.getAttribute('data-program-day'))); });
  });
}());

(function () {
  'use strict';

  document.querySelectorAll('.mbs-la-faq__items').forEach(function (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('details'));

    function closeItem(details) {
      var body = details.querySelector('.mbs-la-faq__body');
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
      var body = details.querySelector('.mbs-la-faq__body');
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
      var body = details.querySelector('.mbs-la-faq__body');
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
