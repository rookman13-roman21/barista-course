import { ROAST_PRESETS, TASTE_OPTIONS } from './rules.js';

export const REPORT_SCHOOL_NAME = 'Московская школа бариста';
export const REPORT_SCHOOL_URL = 'https://baristaschool.ru';

function asFiniteNumber(value) {
  if (value === null || value === '' || typeof value === 'boolean') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { year, month, day, date };
}

export function localIsoDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeRoastDate(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return parseDateOnly(text) ? text : null;
}

export function isFutureRoastDate(value, referenceDate = new Date()) {
  const normalized = normalizeRoastDate(value);
  if (!normalized) return false;
  return normalized > localIsoDate(referenceDate);
}

export function escapeReportHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeReportTitlePart(value) {
  const safe = String(value ?? '')
    .replace(/[\/\\:*?"<>|\p{Cc}\p{Cf}\p{Zl}\p{Zp}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .trim();
  return safe || 'Сессия';
}

function optionalSnapshotText(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

export function normalizeRecommendationSnapshot(rawRecommendation) {
  if (!rawRecommendation || typeof rawRecommendation !== 'object') return null;
  const kind = typeof rawRecommendation.kind === 'string' ? rawRecommendation.kind.trim() : '';
  const title = optionalSnapshotText(rawRecommendation.title, 240);
  const action = optionalSnapshotText(rawRecommendation.action, 2000);
  const explanation = optionalSnapshotText(rawRecommendation.explanation, 2000);
  if (!/^[a-z0-9-]{1,64}$/.test(kind) || !title || !action || !explanation) return null;

  const snapshot = {
    kind,
    title,
    action,
    explanation,
    softWarning: optionalSnapshotText(rawRecommendation.softWarning, 1000),
  };
  const afterAction = optionalSnapshotText(rawRecommendation.afterAction, 1000);
  if (afterAction) snapshot.afterAction = afterAction;
  for (const field of ['targetRatio', 'targetYield', 'targetTime', 'targetTimeMin', 'targetTimeMax', 'targetTemperature']) {
    const number = asFiniteNumber(rawRecommendation[field]);
    if (number !== null) snapshot[field] = number;
  }
  if (typeof rawRecommendation.repeatable === 'boolean') snapshot.repeatable = rawRecommendation.repeatable;
  return snapshot;
}

function formatNumber(value, digits = 1) {
  const number = asFiniteNumber(value);
  if (number === null) return '—';
  return number.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function formatDateOnly(value) {
  const parsed = parseDateOnly(value);
  if (!parsed) return 'не указана';
  return parsed.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function findConfirmedAttempt(session) {
  const attempts = Array.isArray(session?.attempts) ? session.attempts : [];
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    if (attempts[index]?.recommendation?.kind === 'complete') return attempts[index];
  }
  return null;
}

export function summarizeReport(sessions) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  return {
    sessions: safeSessions.length,
    attempts: safeSessions.reduce((total, session) => total + (Array.isArray(session.attempts) ? session.attempts.length : 0), 0),
    completed: safeSessions.filter((session) => session.status === 'completed').length,
    confirmed: safeSessions.filter((session) => Boolean(findConfirmedAttempt(session))).length,
  };
}

function recipeMarkup(session, attempt, label) {
  if (!attempt) return `<div class="ea-report-recipe"><span>${escapeReportHtml(label)}</span><strong>Нет сохранённых шотов</strong></div>`;
  const temperature = session.canAdjustTemperature && attempt.temperature !== null
    ? `${formatNumber(attempt.temperature)} °C`
    : 'не отслеживается';
  return `<div class="ea-report-recipe">
    <span>${escapeReportHtml(label)}</span>
    <strong>${formatNumber(attempt.dose)} г → ${formatNumber(attempt.yield)} г · 1:${formatNumber(attempt.ratio, 2)}</strong>
    <small>${formatNumber(attempt.time)} с · ${temperature}</small>
  </div>`;
}

function starterMarkup(session) {
  const starter = session.starter || {};
  const temperature = session.canAdjustTemperature ? `${formatNumber(starter.temperature)} °C` : 'не меняем';
  return `<div class="ea-report-recipe">
    <span>Базовый рецепт</span>
    <strong>${formatNumber(starter.dose)} г → ${formatNumber(starter.yield)} г · 1:${formatNumber(starter.ratio, 2)}</strong>
    <small>${formatNumber(starter.time)} с · ${temperature}</small>
  </div>`;
}

function attemptRows(session) {
  const attempts = Array.isArray(session.attempts) ? session.attempts : [];
  if (!attempts.length) return '<tbody><tr><td colspan="8" class="ea-report-empty">В этой сессии пока нет шотов.</td></tr></tbody>';
  return attempts.map((attempt, index) => {
    const recommendation = normalizeRecommendationSnapshot(attempt.recommendation);
    const recommendationText = recommendation
      ? `<strong>${escapeReportHtml(recommendation.title)}.</strong> ${escapeReportHtml(recommendation.action)}`
      : 'Рекомендация не зафиксирована';
    const temperature = session.canAdjustTemperature && attempt.temperature !== null
      ? `${formatNumber(attempt.temperature)} °C`
      : '—';
    const taste = TASTE_OPTIONS[attempt.taste] || attempt.taste || '—';
    return `<tbody class="ea-report-shot">
      <tr>
        <td><strong>${index + 1}</strong><small>${escapeReportHtml(formatDateTime(attempt.createdAt))}</small></td>
        <td>${formatNumber(attempt.dose)} г</td>
        <td>${formatNumber(attempt.yield)} г</td>
        <td>1:${formatNumber(attempt.ratio, 2)}</td>
        <td>${formatNumber(attempt.time)} с</td>
        <td>${temperature}</td>
        <td>${escapeReportHtml(taste)}</td>
        <td>${attempt.unstable ? 'Неровный' : 'Без отметки'}</td>
      </tr>
      <tr class="ea-report-shot-detail"><td colspan="8"><b>Следующее действие:</b> ${recommendationText}<br><b>Заметка:</b> ${attempt.notes ? escapeReportHtml(attempt.notes) : '—'}</td></tr>
    </tbody>`;
  }).join('');
}

function sessionMarkup(session, index) {
  const roast = ROAST_PRESETS[session.roast] || ROAST_PRESETS.unknown;
  const confirmed = findConfirmedAttempt(session);
  const attempts = Array.isArray(session.attempts) ? session.attempts : [];
  const result = confirmed || attempts[attempts.length - 1] || null;
  const resultLabel = confirmed ? 'Подтверждённый рецепт' : 'Последний шот';
  const completedAt = session.status === 'completed' ? formatDateTime(session.completedAt) : '—';
  return `<section class="ea-report-session${index ? ' ea-report-session--next' : ''}">
    <div class="ea-report-session-brand"><span>MBS* ${REPORT_SCHOOL_NAME}</span><a href="${REPORT_SCHOOL_URL}">baristaschool.ru</a></div>
    <div class="ea-report-session-head">
      <div><span>Сессия ${index + 1}</span><h2>${escapeReportHtml(session.beanName)}</h2></div>
      <b>${session.status === 'completed' ? 'Завершена' : 'В работе'}</b>
    </div>
    <dl class="ea-report-meta">
      <div><dt>Обжарка</dt><dd>${escapeReportHtml(roast.label)}</dd></div>
      <div><dt>Дата обжарки</dt><dd>${escapeReportHtml(formatDateOnly(session.roastDate))}</dd></div>
      <div><dt>Начало</dt><dd>${escapeReportHtml(formatDateTime(session.createdAt))}</dd></div>
      <div><dt>Завершение</dt><dd>${escapeReportHtml(completedAt)}</dd></div>
      <div><dt>Шотов</dt><dd>${attempts.length}</dd></div>
      <div><dt>Повторяемость</dt><dd>${confirmed ? 'Подтверждена' : 'Не подтверждена'}</dd></div>
    </dl>
    <div class="ea-report-recipes">${starterMarkup(session)}${recipeMarkup(session, result, resultLabel)}</div>
    <table>
      <thead><tr><th>№ / дата</th><th>Доза</th><th>Выход</th><th>Коэфф.</th><th>Время</th><th>Темп.</th><th>Вкус</th><th>Пролив</th></tr></thead>
      ${attemptRows(session)}
    </table>
  </section>`;
}

function reportStyles() {
  return `
    :root{color:#1f2920;font-family:Arial,sans-serif;font-size:10pt;line-height:1.35}
    *{box-sizing:border-box} body{margin:0;background:#eef3ec;color:#1f2920}
    a{color:inherit}.ea-report-toolbar{position:sticky;z-index:10;top:0;display:flex;gap:10px;justify-content:flex-end;padding:12px 18px;background:#1f2920}
    .ea-report-toolbar button{min-height:42px;padding:9px 18px;border:0;border-radius:999px;background:#fff;color:#417033;cursor:pointer;font:700 14px Arial,sans-serif}
    .ea-report-toolbar button:first-child{background:#cc2841;color:#fff}.ea-report-page{max-width:1120px;margin:22px auto;padding:34px;background:#fff;box-shadow:0 12px 38px rgba(31,41,32,.12)}
    .ea-report-brand{display:grid;grid-template-columns:128px 1fr auto;gap:22px;align-items:center;padding-bottom:22px;border-bottom:3px solid #417033}
    .ea-report-logo{width:128px;height:38px;object-fit:cover;object-position:center}.ea-report-brand span,.ea-report-session-brand span{color:#417033;font-size:9px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}
    .ea-report-title{margin:3px 0 0;font-size:27px;font-weight:700;line-height:1.05}.ea-report-brand a{font-weight:700}.ea-report-generated{margin:12px 0 0;color:#5b675b}
    .ea-report-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:22px 0}.ea-report-summary div{padding:14px;border-radius:12px;background:#e7f2e3}.ea-report-summary strong{display:block;font-size:22px}.ea-report-summary span{color:#5b675b;font-size:9px}
    .ea-report-session{padding-top:8px}.ea-report-session--next{break-before:page}.ea-report-session-brand{display:flex;justify-content:space-between;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #b6d8ab}
    .ea-report-session-head{display:flex;gap:20px;align-items:flex-start;justify-content:space-between}.ea-report-session-head span{color:#417033;font-size:9px;font-weight:800;text-transform:uppercase}.ea-report-session-head h2{margin:2px 0 0;font-size:22px}.ea-report-session-head>b{padding:5px 9px;border-radius:999px;background:#f8dde1;color:#a52236;font-size:9px;text-transform:uppercase}
    .ea-report-meta{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:14px 0}.ea-report-meta div{padding:9px;border:1px solid #d8e2d5;border-radius:9px}.ea-report-meta dt{color:#697469;font-size:8px}.ea-report-meta dd{margin:3px 0 0;font-weight:700;font-size:9px}
    .ea-report-recipes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}.ea-report-recipe{padding:11px 13px;border-radius:10px;background:#e7f2e3}.ea-report-recipe span,.ea-report-recipe small{display:block;color:#5b675b;font-size:8px}.ea-report-recipe strong{display:block;margin:3px 0;font-size:11px}
    table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:8px}thead{display:table-header-group}th{padding:7px 6px;background:#417033;color:#fff;text-align:left}th:nth-child(1){width:12%}th:nth-child(2),th:nth-child(3),th:nth-child(4),th:nth-child(5),th:nth-child(6){width:8%}th:nth-child(7){width:25%}th:nth-child(8){width:15%}
    td{padding:7px 6px;border:1px solid #d8e2d5;vertical-align:top;overflow-wrap:anywhere}.ea-report-shot{break-inside:avoid}.ea-report-shot td small{display:block;margin-top:2px;color:#6f796f;font-size:7px}.ea-report-shot-detail td{padding:6px 8px;background:#f5f5f5;line-height:1.45}.ea-report-empty{text-align:center;color:#5b675b}
    .ea-report-footer{position:fixed;right:0;bottom:0;left:0;text-align:center;color:#5b675b;font-size:8px}
    @page{size:A4 landscape;margin:12mm 10mm 16mm}
    @media print{body{background:#fff}.ea-report-toolbar{display:none}.ea-report-page{max-width:none;margin:0;padding:0;box-shadow:none}.ea-report-summary{break-inside:avoid}.ea-report-brand{break-inside:avoid}}
    @media screen and (max-width:700px){.ea-report-page{margin:0;padding:20px}.ea-report-brand{grid-template-columns:72px minmax(0,1fr);gap:14px;align-items:start}.ea-report-logo{width:72px;height:34px;object-fit:contain;object-position:left center}.ea-report-brand>div{min-width:0}.ea-report-title{font-size:24px;line-height:1.1}.ea-report-brand>a{grid-column:1/-1}.ea-report-summary{grid-template-columns:1fr 1fr}.ea-report-meta{grid-template-columns:1fr 1fr}.ea-report-recipes{grid-template-columns:1fr}.ea-report-toolbar{justify-content:stretch}.ea-report-toolbar button{flex:1}}
  `;
}

export function buildReportDocument({ sessions = [], mode = 'journal', logoDataUri = '', generatedAt = new Date() } = {}) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const summary = summarizeReport(safeSessions);
  const titlePart = mode === 'session' && safeSessions[0]
    ? sanitizeReportTitlePart(safeSessions[0].beanName)
    : 'Все сессии';
  const title = `MBS - Журнал эспрессо - ${titlePart} - ${localIsoDate(generatedAt)}`;
  const sessionSections = safeSessions.map(sessionMarkup).join('');
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeReportHtml(title)}</title><style>${reportStyles()}</style></head>
  <body><div class="ea-report-toolbar"><button type="button" onclick="window.print()">Сохранить как PDF</button><button type="button" onclick="window.close()">Закрыть</button></div>
  <main class="ea-report-page">
    <header class="ea-report-brand"><img class="ea-report-logo" src="${escapeReportHtml(logoDataUri)}" alt="MBS*"><div><span>${REPORT_SCHOOL_NAME}</span><div class="ea-report-title" role="heading" aria-level="1">Журнал настройки эспрессо</div></div><a href="${REPORT_SCHOOL_URL}">baristaschool.ru</a></header>
    <p class="ea-report-generated">Сформирован ${escapeReportHtml(formatDateTime(generatedAt))}</p>
    <section class="ea-report-summary" aria-label="Сводка"><div><strong>${summary.sessions}</strong><span>сессий</span></div><div><strong>${summary.attempts}</strong><span>шотов</span></div><div><strong>${summary.completed}</strong><span>завершено</span></div><div><strong>${summary.confirmed}</strong><span>повторяемость подтверждена</span></div></section>
    ${sessionSections || '<p class="ea-report-empty">В журнале пока нет сохранённых результатов.</p>'}
  </main><footer class="ea-report-footer">${REPORT_SCHOOL_NAME} · baristaschool.ru</footer></body></html>`;
  return { title, html };
}
