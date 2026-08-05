(function () {
  const root = document.querySelector('[data-mbs-espresso-assistant-root]');
  if (!root || root.getAttribute('data-app-ready') === '1') return;
  root.setAttribute('data-app-ready', '1');

  const STORAGE_SESSIONS = 'mbsEspressoAssistant:v1:sessions';
  const STORAGE_ACTIVE = 'mbsEspressoAssistant:v1:activeSessionId';
  const MAX_SESSIONS = 10;
  const MAX_ATTEMPTS = 30;

  const elements = {
    corrupt: root.querySelector('[data-corrupt-notice]'),
    createSection: root.querySelector('[data-create-section]'),
    createForm: root.querySelector('[data-create-form]'),
    library: root.querySelector('[data-session-library]'),
    sessionList: root.querySelector('[data-session-list]'),
    resetAll: root.querySelector('[data-reset-all]'),
    exportAll: root.querySelector('[data-export-all]'),
    workspace: root.querySelector('[data-workspace]'),
    sessionName: root.querySelector('[data-session-name]'),
    sessionMeta: root.querySelector('[data-session-meta]'),
    sessionStatus: root.querySelector('[data-session-status]'),
    createRoastDate: root.querySelector('[data-create-roast-date]'),
    createRoastDateDisplay: root.querySelector('[data-create-roast-date-display]'),
    editRoastDate: root.querySelector('[data-edit-roast-date]'),
    roastDateForm: root.querySelector('[data-roast-date-form]'),
    roastDateInput: root.querySelector('[data-roast-date-input]'),
    roastDateDisplay: root.querySelector('[data-roast-date-display]'),
    roastDateError: root.querySelector('[data-roast-date-error]'),
    cancelRoastDate: root.querySelector('[data-cancel-roast-date]'),
    starterDose: root.querySelector('[data-starter-dose]'),
    starterYield: root.querySelector('[data-starter-yield]'),
    starterRatio: root.querySelector('[data-starter-ratio]'),
    starterTime: root.querySelector('[data-starter-time]'),
    starterTemperature: root.querySelector('[data-starter-temperature]'),
    attemptForm: root.querySelector('[data-attempt-form]'),
    dose: root.querySelector('[data-attempt-dose]'),
    beverageYield: root.querySelector('[data-attempt-yield]'),
    time: root.querySelector('[data-attempt-time]'),
    temperatureWrap: root.querySelector('[data-temperature-wrap]'),
    temperature: root.querySelector('[data-attempt-temperature]'),
    taste: root.querySelector('[data-attempt-taste]'),
    unstable: root.querySelector('[data-attempt-unstable]'),
    notes: root.querySelector('[data-attempt-notes]'),
    ratioPreview: root.querySelector('[data-ratio-preview]'),
    recommendation: root.querySelector('[data-recommendation]'),
    attemptList: root.querySelector('[data-attempt-list]'),
    attemptEmpty: root.querySelector('[data-attempt-empty]'),
    finish: root.querySelector('[data-finish-session]'),
    resume: root.querySelector('[data-resume-session]'),
    copy: root.querySelector('[data-copy-recipe]'),
    exportSession: root.querySelector('[data-export-session]'),
    close: root.querySelector('[data-close-session]'),
    live: root.querySelector('[data-live-status]'),
  };

  let sessions = [];
  let activeSessionId = null;
  let storageCorrupt = false;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatNumber(value, digits = 1) {
    const number = Number(value);
    if (!Number.isFinite(number)) return '—';
    return number.toLocaleString('ru-RU', {
      minimumFractionDigits: Number.isInteger(number) ? 0 : digits,
      maximumFractionDigits: digits,
    });
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatRoastDate(value) {
    const normalized = normalizeRoastDate(value);
    if (!normalized) return 'не указана';
    const [year, month, day] = normalized.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  function formatRoastDateInput(value) {
    const normalized = normalizeRoastDate(value);
    if (!normalized) return '';
    const [year, month, day] = normalized.split('-');
    return `${day}.${month}.${year}`;
  }

  function setRoastDateControl(input, display, value) {
    const normalized = normalizeRoastDate(value);
    input.value = normalized || '';
    display.textContent = normalized ? formatRoastDateInput(normalized) : 'Выберите дату';
    display.classList.toggle('mbs-espresso-assistant__date-display--selected', Boolean(normalized));
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeAttempt(rawAttempt, session) {
    if (!rawAttempt || typeof rawAttempt !== 'object') return null;
    const dose = Number(rawAttempt.dose);
    const beverageYield = Number(rawAttempt.yield);
    const time = Number(rawAttempt.time);
    const temperature = session.canAdjustTemperature ? Number(rawAttempt.temperature) : null;
    if (!Number.isFinite(dose) || dose <= 0 || !Number.isFinite(beverageYield) || beverageYield <= 0 || !Number.isFinite(time) || time <= 0) return null;
    if (!Object.prototype.hasOwnProperty.call(TASTE_OPTIONS, rawAttempt.taste)) return null;
    if (session.canAdjustTemperature
      && (!Number.isFinite(temperature) || temperature < ESPRESSO_LIMITS.temperatureMin || temperature > ESPRESSO_LIMITS.temperatureMax)) return null;

    const normalized = {
      id: typeof rawAttempt.id === 'string' && rawAttempt.id ? rawAttempt.id : makeId('shot'),
      createdAt: typeof rawAttempt.createdAt === 'string' ? rawAttempt.createdAt : new Date().toISOString(),
      dose,
      yield: beverageYield,
      time,
      temperature,
      taste: rawAttempt.taste,
      unstable: Boolean(rawAttempt.unstable),
      notes: typeof rawAttempt.notes === 'string' ? rawAttempt.notes.slice(0, 280) : '',
    };
    normalized.ratio = calculateRatio(normalized.dose, normalized.yield);
    normalized.recommendation = normalizeRecommendationSnapshot(rawAttempt.recommendation);
    return normalized;
  }

  function normalizeSession(rawSession) {
    if (!rawSession || typeof rawSession !== 'object' || typeof rawSession.id !== 'string' || !rawSession.id) return null;
    if (typeof rawSession.beanName !== 'string' || !rawSession.beanName.trim()) return null;
    if (!Object.prototype.hasOwnProperty.call(ROAST_PRESETS, rawSession.roast)) return null;
    if (typeof rawSession.canAdjustTemperature !== 'boolean') return null;
    const dose = Number(rawSession.dose);
    if (!Number.isFinite(dose) || dose <= 0 || !Array.isArray(rawSession.attempts)) return null;

    const session = {
      id: rawSession.id,
      beanName: rawSession.beanName.trim().slice(0, 80),
      roastDate: normalizeRoastDate(rawSession.roastDate),
      roast: rawSession.roast,
      dose,
      canAdjustTemperature: rawSession.canAdjustTemperature,
      starter: getStarterRecipe({ roast: rawSession.roast, dose }),
      status: rawSession.status === 'completed' ? 'completed' : 'active',
      createdAt: typeof rawSession.createdAt === 'string' ? rawSession.createdAt : new Date().toISOString(),
      updatedAt: typeof rawSession.updatedAt === 'string' ? rawSession.updatedAt : new Date().toISOString(),
      attempts: [],
    };
    if (session.status === 'completed' && typeof rawSession.completedAt === 'string') session.completedAt = rawSession.completedAt;

    const rawAttempts = rawSession.attempts.slice(-MAX_ATTEMPTS);
    rawAttempts.forEach((rawAttempt) => {
      const normalizedAttempt = normalizeAttempt(rawAttempt, session);
      if (normalizedAttempt) session.attempts.push(normalizedAttempt);
      else storageCorrupt = true;
    });
    if (rawSession.attempts.length > MAX_ATTEMPTS) storageCorrupt = true;
    return session;
  }

  function announce(message) {
    if (!elements.live) return;
    elements.live.textContent = '';
    window.setTimeout(() => { elements.live.textContent = message; }, 20);
  }

  function loadStorage() {
    try {
      const rawSessions = window.localStorage.getItem(STORAGE_SESSIONS);
      if (rawSessions) {
        const parsed = JSON.parse(rawSessions);
        if (!Array.isArray(parsed)) throw new Error('Sessions payload must be an array');
        const normalized = parsed.map(normalizeSession).filter(Boolean);
        if (normalized.length !== parsed.length || parsed.length > MAX_SESSIONS) storageCorrupt = true;
        sessions = normalized.slice(0, MAX_SESSIONS);
      }
      const storedActive = window.localStorage.getItem(STORAGE_ACTIVE);
      activeSessionId = sessions.some((session) => session.id === storedActive) ? storedActive : null;
      if (storedActive && !activeSessionId) storageCorrupt = true;
    } catch (error) {
      console.error('[mbs-espresso-assistant] stored data is invalid', error);
      sessions = [];
      activeSessionId = null;
      storageCorrupt = true;
    }
  }

  function saveSessions() {
    try {
      window.localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(sessions));
      storageCorrupt = false;
      if (activeSessionId) window.localStorage.setItem(STORAGE_ACTIVE, activeSessionId);
      else window.localStorage.removeItem(STORAGE_ACTIVE);
      return true;
    } catch (error) {
      console.error('[mbs-espresso-assistant] could not save sessions', error);
      announce('Не удалось сохранить данные в браузере.');
      return false;
    }
  }

  function activeSession() {
    return sessions.find((session) => session.id === activeSessionId) || null;
  }

  function updateSession(session) {
    session.updatedAt = new Date().toISOString();
    sessions = [session, ...sessions.filter((item) => item.id !== session.id)].slice(0, MAX_SESSIONS);
    saveSessions();
  }

  function renderCorruptNotice() {
    elements.corrupt.hidden = !storageCorrupt;
  }

  function renderLibrary() {
    elements.resetAll.hidden = sessions.length === 0 && !storageCorrupt;
    elements.exportAll.hidden = !sessions.some((session) => session.attempts.length > 0);
    if (!sessions.length) {
      elements.sessionList.innerHTML = '<p class="mbs-espresso-assistant__empty">Здесь появятся сохранённые сессии для разных зёрен.</p>';
      return;
    }

    elements.sessionList.innerHTML = sessions.map((session) => {
      const lastAttempt = session.attempts[session.attempts.length - 1];
      const status = session.status === 'completed' ? 'Завершена' : 'В работе';
      const result = lastAttempt
        ? `${formatNumber(lastAttempt.dose)} г → ${formatNumber(lastAttempt.yield)} г · ${formatNumber(lastAttempt.time)} с`
        : 'Пока без попыток';
      return `
        <article class="mbs-espresso-assistant__saved-session">
          <div>
            <span class="mbs-espresso-assistant__status mbs-espresso-assistant__status--${session.status === 'completed' ? 'complete' : 'active'}">${status}</span>
            <h3>${escapeHtml(session.beanName)}</h3>
            <p>${escapeHtml(result)} · ${session.attempts.length} ${session.attempts.length === 1 ? 'попытка' : 'попыток'}</p>
            <div class="mbs-espresso-assistant__saved-meta">
              <span class="mbs-espresso-assistant__saved-roast-date">Дата обжарки: ${escapeHtml(formatRoastDate(session.roastDate))}</span>
              <span>Обновлено ${escapeHtml(formatDate(session.updatedAt || session.createdAt))}</span>
            </div>
          </div>
          <div class="mbs-espresso-assistant__saved-actions">
            <button class="mbs-espresso-assistant__button mbs-espresso-assistant__button--secondary" type="button" data-open-session="${escapeHtml(session.id)}">Открыть</button>
            ${lastAttempt ? `<button class="mbs-espresso-assistant__text-button" type="button" data-export-session-id="${escapeHtml(session.id)}">PDF</button>` : ''}
            <button class="mbs-espresso-assistant__text-button mbs-espresso-assistant__text-button--danger" type="button" data-delete-session="${escapeHtml(session.id)}">Удалить</button>
          </div>
        </article>`;
    }).join('');
  }

  function displayRecommendation(session, attempt) {
    if (!attempt) return { recommendation: null, historical: false };
    if (attempt.recommendation) return { recommendation: attempt.recommendation, historical: true };
    const index = session.attempts.indexOf(attempt);
    return {
      recommendation: buildRecommendation({
        attempt,
        session,
        previousAttempts: session.attempts.slice(0, Math.max(0, index)),
      }),
      historical: false,
    };
  }

  function renderStarter(session) {
    const starter = session.starter || getStarterRecipe(session);
    elements.starterDose.textContent = `${formatNumber(starter.dose)} г`;
    elements.starterYield.textContent = `${formatNumber(starter.yield)} г`;
    elements.starterRatio.textContent = `1:${formatNumber(starter.ratio)}`;
    elements.starterTime.textContent = `${formatNumber(starter.time)} с`;
    elements.starterTemperature.textContent = session.canAdjustTemperature
      ? `${formatNumber(starter.temperature)} °C`
      : 'Не меняем';
  }

  function renderRecommendation(session) {
    const lastAttempt = session.attempts[session.attempts.length - 1];
    if (!lastAttempt) {
      const starter = session.starter;
      elements.recommendation.className = 'mbs-espresso-assistant__recommendation mbs-espresso-assistant__recommendation--start';
      elements.recommendation.innerHTML = `
        <p class="mbs-espresso-assistant__kicker">Первый шот</p>
        <h3>Начните с базового рецепта</h3>
        <p class="mbs-espresso-assistant__recommendation-action">${formatNumber(starter.dose)} г кофе → ${formatNumber(starter.yield)} г напитка за ${formatNumber(starter.time)} с${session.canAdjustTemperature ? ` при ${formatNumber(starter.temperature)} °C` : ''}.</p>
        <p>После пролива взвесьте напиток, запишите время и выберите главное впечатление от вкуса.</p>`;
      return;
    }

    const displayed = displayRecommendation(session, lastAttempt);
    const recommendation = displayed.recommendation;
    const warning = recommendation.softWarning
      ? `<p class="mbs-espresso-assistant__soft-warning">${escapeHtml(recommendation.softWarning)}</p>`
      : '';
    const afterAction = recommendation.afterAction
      ? `<p class="mbs-espresso-assistant__soft-warning">${escapeHtml(recommendation.afterAction)}</p>`
      : '';
    elements.recommendation.className = `mbs-espresso-assistant__recommendation mbs-espresso-assistant__recommendation--${escapeHtml(recommendation.kind)}`;
    elements.recommendation.innerHTML = `
      <p class="mbs-espresso-assistant__kicker">${displayed.historical ? 'Следующее одно действие' : 'Подсказка по текущей методике'}</p>
      <h3>${escapeHtml(recommendation.title)}</h3>
      <p class="mbs-espresso-assistant__recommendation-action">${escapeHtml(recommendation.action)}</p>
      <p>${escapeHtml(recommendation.explanation)}</p>
      ${afterAction}
      ${warning}
      ${displayed.historical ? '' : '<p class="mbs-espresso-assistant__soft-warning">Историческая рекомендация для этого шота не была зафиксирована.</p>'}`;
  }

  function renderAttempts(session) {
    elements.attemptEmpty.hidden = session.attempts.length > 0;
    elements.attemptList.innerHTML = session.attempts.slice().reverse().map((item, reverseIndex) => {
      const number = session.attempts.length - reverseIndex;
      const temperature = session.canAdjustTemperature && item.temperature !== null
        ? ` · ${formatNumber(item.temperature)} °C`
        : '';
      const flags = item.unstable ? ' · неровный пролив' : '';
      return `
        <li class="mbs-espresso-assistant__attempt">
          <div class="mbs-espresso-assistant__attempt-top">
            <strong>Шот ${number}</strong>
            <span>1:${formatNumber(item.ratio, 2)}</span>
          </div>
          <p>${formatNumber(item.dose)} г → ${formatNumber(item.yield)} г · ${formatNumber(item.time)} с${temperature}</p>
          <p class="mbs-espresso-assistant__attempt-taste">${escapeHtml(TASTE_OPTIONS[item.taste] || item.taste)}${flags}</p>
          ${item.notes ? `<p class="mbs-espresso-assistant__attempt-note">${escapeHtml(item.notes)}</p>` : ''}
        </li>`;
    }).join('');
  }

  function prefillAttemptForm(session) {
    const last = session.attempts[session.attempts.length - 1];
    const recommendation = last ? displayRecommendation(session, last).recommendation : null;
    elements.dose.value = last ? last.dose : session.starter.dose;
    elements.beverageYield.value = recommendation && recommendation.targetYield
      ? recommendation.targetYield
      : (last ? last.yield : session.starter.yield);
    elements.time.value = '';
    elements.temperatureWrap.hidden = !session.canAdjustTemperature;
    elements.temperature.required = Boolean(session.canAdjustTemperature);
    elements.temperature.value = session.canAdjustTemperature
      ? (recommendation && recommendation.targetTemperature
        ? recommendation.targetTemperature
        : (last && last.temperature !== null ? last.temperature : session.starter.temperature))
      : '';
    elements.taste.value = '';
    elements.unstable.checked = false;
    elements.notes.value = '';
    updateRatioPreview();
  }

  function renderWorkspace(session) {
    elements.sessionName.textContent = session.beanName;
    const roast = ROAST_PRESETS[session.roast] || ROAST_PRESETS.unknown;
    elements.sessionMeta.textContent = `${roast.label} обжарка · дата обжарки: ${formatRoastDate(session.roastDate)} · базовая дозировка ${formatNumber(session.dose)} г · ${session.canAdjustTemperature ? 'температуру можно менять' : 'температуру не меняем'}`;
    elements.editRoastDate.textContent = session.roastDate ? 'Изменить дату обжарки' : 'Добавить дату обжарки';
    elements.roastDateForm.hidden = true;
    setRoastDateControl(elements.roastDateInput, elements.roastDateDisplay, session.roastDate);
    elements.roastDateError.hidden = true;
    elements.roastDateError.textContent = '';
    elements.sessionStatus.textContent = session.status === 'completed' ? 'Сессия завершена' : `Попыток: ${session.attempts.length}/${MAX_ATTEMPTS}`;
    elements.sessionStatus.className = `mbs-espresso-assistant__status mbs-espresso-assistant__status--${session.status === 'completed' ? 'complete' : 'active'}`;
    renderStarter(session);
    renderRecommendation(session);
    renderAttempts(session);

    const hasAttempts = session.attempts.length > 0;
    elements.attemptForm.hidden = session.status === 'completed';
    elements.resume.hidden = session.status !== 'completed';
    elements.finish.hidden = session.status === 'completed' || !hasAttempts;
    elements.copy.hidden = !hasAttempts;
    elements.exportSession.hidden = !hasAttempts;
    if (session.status !== 'completed') prefillAttemptForm(session);
  }

  function render() {
    renderCorruptNotice();
    renderLibrary();
    const session = activeSession();
    elements.createSection.hidden = Boolean(session);
    elements.library.hidden = Boolean(session);
    elements.workspace.hidden = !session;
    if (session) renderWorkspace(session);
  }

  function updateRatioPreview() {
    const ratio = calculateRatio(elements.dose.value, elements.beverageYield.value);
    elements.ratioPreview.textContent = ratio === null
      ? 'Коэффициент появится после ввода дозировки и выхода.'
      : `Коэффициент: ${formatNumber(elements.beverageYield.value)} ÷ ${formatNumber(elements.dose.value)} = 1:${formatNumber(ratio, 2)}`;
  }

  function validateRoastDate(value, input, errorElement = null) {
    const raw = String(value || '').trim();
    const normalized = normalizeRoastDate(raw);
    let message = '';
    if (raw && !normalized) message = 'Введите дату в формате ДД.ММ.ГГГГ.';
    else if (raw && isFutureRoastDate(normalized)) message = 'Дата обжарки не может быть позже сегодняшней. Исправьте её или оставьте поле пустым.';
    input.setCustomValidity(message);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = !message;
    }
    if (message) {
      input.reportValidity();
      announce(message);
      return false;
    }
    return true;
  }

  function createSession(event) {
    event.preventDefault();
    const formData = new FormData(elements.createForm);
    const preparationChecks = Array.from(elements.createForm.querySelectorAll('[data-preparation-check]'));
    if (!preparationChecks.every((input) => input.checked)) {
      announce('Подтвердите всю подготовку перед началом.');
      preparationChecks.find((input) => !input.checked)?.focus();
      return;
    }

    if (sessions.length >= MAX_SESSIONS) {
      const oldest = sessions[sessions.length - 1];
      if (!window.confirm(`Уже сохранено ${MAX_SESSIONS} сессий. Создание новой удалит самую старую «${oldest.beanName}». Продолжить?`)) return;
      sessions = sessions.slice(0, MAX_SESSIONS - 1);
    }

    const beanName = String(formData.get('beanName') || '').trim();
    const rawRoastDate = String(formData.get('roastDate') || '').trim();
    const roast = String(formData.get('roast') || 'unknown');
    const dose = Number(formData.get('dose'));
    const canAdjustTemperature = formData.get('canAdjustTemperature') === 'yes';
    if (!beanName) {
      announce('Введите название зерна или смеси.');
      elements.createForm.elements.beanName.focus();
      return;
    }
    if (!validateRoastDate(rawRoastDate, elements.createRoastDate)) return;
    const now = new Date().toISOString();
    const session = {
      id: makeId('session'),
      beanName,
      roastDate: normalizeRoastDate(rawRoastDate),
      roast,
      dose,
      canAdjustTemperature,
      starter: getStarterRecipe({ roast, dose }),
      status: 'active',
      createdAt: now,
      updatedAt: now,
      attempts: [],
    };
    sessions = [session, ...sessions];
    activeSessionId = session.id;
    saveSessions();
    render();
    elements.sessionName.focus();
    announce(`Сессия для зерна «${beanName}» создана.`);
  }

  function addAttempt(event) {
    event.preventDefault();
    const session = activeSession();
    if (!session || session.status === 'completed') return;
    if (session.attempts.length >= MAX_ATTEMPTS) {
      announce('В этой сессии уже 30 попыток. Завершите её или начните новую.');
      return;
    }

    const item = {
      id: makeId('shot'),
      createdAt: new Date().toISOString(),
      dose: Number(elements.dose.value),
      yield: Number(elements.beverageYield.value),
      time: Number(elements.time.value),
      temperature: session.canAdjustTemperature ? Number(elements.temperature.value) : null,
      taste: elements.taste.value,
      unstable: elements.unstable.checked,
      notes: elements.notes.value.trim().slice(0, 280),
    };
    item.ratio = calculateRatio(item.dose, item.yield);
    item.recommendation = normalizeRecommendationSnapshot(buildRecommendation({
      attempt: item,
      session,
      previousAttempts: session.attempts,
    }));
    session.attempts.push(item);
    updateSession(session);
    render();
    elements.recommendation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    announce(item.recommendation.action);
  }

  function openSession(id) {
    if (!sessions.some((session) => session.id === id)) return;
    activeSessionId = id;
    saveSessions();
    render();
    elements.sessionName.focus();
  }

  function closeSession() {
    activeSessionId = null;
    saveSessions();
    render();
    elements.createForm.querySelector('input')?.focus();
  }

  function deleteSession(id) {
    const session = sessions.find((item) => item.id === id);
    if (!session || !window.confirm(`Удалить сессию «${session.beanName}» и все её попытки?`)) return;
    sessions = sessions.filter((item) => item.id !== id);
    if (activeSessionId === id) activeSessionId = null;
    saveSessions();
    render();
    announce('Сессия удалена.');
  }

  function finishSession() {
    const session = activeSession();
    if (!session || !session.attempts.length) return;
    const last = session.attempts[session.attempts.length - 1];
    const isConfirmed = last.recommendation?.kind === 'complete';
    const question = isConfirmed
      ? 'Сохранить повторяемый рецепт и завершить сессию?'
      : 'Завершить сессию? Два повторяемых сбалансированных шота пока не подтверждены.';
    if (!window.confirm(question)) return;
    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    updateSession(session);
    render();
    announce('Сессия завершена и сохранена.');
  }

  function resumeSession() {
    const session = activeSession();
    if (!session) return;
    session.status = 'active';
    delete session.completedAt;
    updateSession(session);
    render();
    announce('Сессия снова активна.');
  }

  function showRoastDateEditor() {
    const session = activeSession();
    if (!session) return;
    elements.roastDateForm.hidden = false;
    setRoastDateControl(elements.roastDateInput, elements.roastDateDisplay, session.roastDate);
    elements.roastDateInput.setCustomValidity('');
    elements.roastDateError.hidden = true;
    elements.roastDateInput.focus();
  }

  function cancelRoastDateEditor() {
    elements.roastDateForm.hidden = true;
    elements.roastDateInput.setCustomValidity('');
    elements.roastDateError.hidden = true;
    elements.editRoastDate.focus();
  }

  function saveRoastDate(event) {
    event.preventDefault();
    const session = activeSession();
    if (!session || !validateRoastDate(elements.roastDateInput.value, elements.roastDateInput, elements.roastDateError)) return;
    session.roastDate = normalizeRoastDate(elements.roastDateInput.value);
    updateSession(session);
    render();
    elements.editRoastDate.focus();
    announce(session.roastDate ? 'Дата обжарки сохранена.' : 'Дата обжарки удалена.');
  }

  function openReport(reportSessions, mode) {
    const selected = reportSessions.filter((session) => session.attempts.length > 0);
    if (!selected.length) {
      announce('Сначала сохраните хотя бы один шот.');
      return;
    }
    const report = buildReportDocument({
      sessions: selected,
      mode,
      logoDataUri: MBS_ESPRESSO_LOGO_DATA_URI,
      generatedAt: new Date(),
    });
    const previous = document.querySelector('[data-mbs-espresso-assistant-print-root]');
    if (previous) previous.remove();
    const compactPrint = window.matchMedia('(max-width: 700px)').matches;
    const printStyle = document.createElement('style');
    printStyle.media = 'print';
    printStyle.dataset.mbsEspressoAssistantPrintStyle = 'true';
    printStyle.textContent = `${report.printStyles}${compactPrint ? '\n@page{size:210mm 297mm;margin:12mm 10mm 16mm}' : ''}\n@media print{body>*{display:none!important}body>[data-mbs-espresso-assistant-print-root]{display:block!important}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-page{width:240mm!important;max-width:240mm!important;margin-left:0!important;margin-right:0!important;padding-right:5mm!important;overflow:visible!important}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-footer{width:235mm!important;max-width:235mm!important;margin-left:0!important;margin-right:0!important}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-summary,body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-meta{grid-template-columns:repeat(2,minmax(0,1fr))}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-recipes{grid-template-columns:1fr}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-brand{grid-template-columns:90px minmax(0,1fr);gap:12px}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-logo{width:90px;height:27px}body>[data-mbs-espresso-assistant-print-root].mbs-espresso-assistant-print-root--compact .ea-report-brand>a{grid-column:1/-1}}`;
    const printRoot = document.createElement('section');
    printRoot.hidden = true;
    printRoot.dataset.mbsEspressoAssistantPrintRoot = 'true';
    printRoot.classList.toggle('mbs-espresso-assistant-print-root--compact', compactPrint);
    printRoot.innerHTML = report.printMarkup;
    const previousTitle = document.title;
    const cleanup = () => {
      printRoot.remove();
      printStyle.remove();
      document.title = previousTitle;
    };
    document.head.append(printStyle);
    document.body.append(printRoot);
    document.title = report.title;
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 30000);
    announce('Открылось системное окно печати. Выберите «Сохранить как PDF».');
  }

  function exportCurrentSession() {
    const session = activeSession();
    if (session) openReport([session], 'session');
  }

  function exportAllSessions() {
    openReport(sessions.slice(), 'journal');
  }

  function exportSessionById(id) {
    const session = sessions.find((item) => item.id === id);
    if (session) openReport([session], 'session');
  }

  function copyFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  async function copyRecipe() {
    const session = activeSession();
    const last = session && session.attempts[session.attempts.length - 1];
    if (!session || !last) return;
    const roast = ROAST_PRESETS[session.roast] || ROAST_PRESETS.unknown;
    const roastDate = `\nДата обжарки: ${formatRoastDate(session.roastDate)}`;
    const temperature = session.canAdjustTemperature && last.temperature !== null
      ? `\nТемпература: ${formatNumber(last.temperature)} °C`
      : '';
    const text = `Рецепт эспрессо MBS*\nЗерно: ${session.beanName}${roastDate}\nОбжарка: ${roast.label.toLowerCase()}\nДозировка: ${formatNumber(last.dose)} г\nВыход: ${formatNumber(last.yield)} г\nКоэффициент: 1:${formatNumber(last.ratio, 2)}\nВремя: ${formatNumber(last.time)} с${temperature}\nВкус: ${TASTE_OPTIONS[last.taste] || last.taste}`;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else if (!copyFallback(text)) throw new Error('Copy command failed');
      announce('Рецепт скопирован.');
    } catch (error) {
      console.error('[mbs-espresso-assistant] copy failed', error);
      announce('Не удалось скопировать рецепт.');
    }
  }

  function resetAll() {
    if (!window.confirm('Удалить все сохранённые сессии и попытки? Это действие нельзя отменить.')) return;
    sessions = [];
    activeSessionId = null;
    try {
      window.localStorage.removeItem(STORAGE_SESSIONS);
      window.localStorage.removeItem(STORAGE_ACTIVE);
      storageCorrupt = false;
    } catch (error) {
      console.error('[mbs-espresso-assistant] reset failed', error);
    }
    render();
    announce('Все сессии удалены.');
  }

  elements.createForm.addEventListener('submit', createSession);
  elements.attemptForm.addEventListener('submit', addAttempt);
  elements.dose.addEventListener('input', updateRatioPreview);
  elements.beverageYield.addEventListener('input', updateRatioPreview);
  elements.close.addEventListener('click', closeSession);
  elements.finish.addEventListener('click', finishSession);
  elements.resume.addEventListener('click', resumeSession);
  elements.copy.addEventListener('click', copyRecipe);
  elements.exportSession.addEventListener('click', exportCurrentSession);
  elements.exportAll.addEventListener('click', exportAllSessions);
  elements.editRoastDate.addEventListener('click', showRoastDateEditor);
  elements.cancelRoastDate.addEventListener('click', cancelRoastDateEditor);
  elements.roastDateForm.addEventListener('submit', saveRoastDate);
  function refreshCreateRoastDate() {
    setRoastDateControl(elements.createRoastDate, elements.createRoastDateDisplay, elements.createRoastDate.value);
    elements.createRoastDate.setCustomValidity('');
  }
  function refreshRoastDateEditor() {
    setRoastDateControl(elements.roastDateInput, elements.roastDateDisplay, elements.roastDateInput.value);
    elements.roastDateInput.setCustomValidity('');
    elements.roastDateError.hidden = true;
  }
  elements.createRoastDate.addEventListener('input', refreshCreateRoastDate);
  elements.createRoastDate.addEventListener('change', refreshCreateRoastDate);
  elements.roastDateInput.addEventListener('input', refreshRoastDateEditor);
  elements.roastDateInput.addEventListener('change', refreshRoastDateEditor);
  elements.resetAll.addEventListener('click', resetAll);
  elements.sessionList.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-session]');
    const exportButton = event.target.closest('[data-export-session-id]');
    const deleteButton = event.target.closest('[data-delete-session]');
    if (openButton) openSession(openButton.getAttribute('data-open-session'));
    if (exportButton) exportSessionById(exportButton.getAttribute('data-export-session-id'));
    if (deleteButton) deleteSession(deleteButton.getAttribute('data-delete-session'));
  });

  loadStorage();
  refreshCreateRoastDate();
  render();
}());
