import assert from 'node:assert/strict';
import {
  buildReportDocument,
  findConfirmedAttempt,
  isFutureRoastDate,
  localIsoDate,
  normalizeRecommendationSnapshot,
  normalizeRoastDate,
  sanitizeReportTitlePart,
  summarizeReport,
} from '../src/report.js';

const recommendation = (overrides = {}) => ({
  kind: 'ratio-up',
  title: 'Сохранённый совет',
  action: 'Увеличить выход по старой методике.',
  explanation: 'Этот текст был показан во время шота.',
  softWarning: '',
  ...overrides,
});

const attempt = (overrides = {}) => ({
  id: 'shot-1',
  createdAt: '2026-08-05T09:30:00.000Z',
  dose: 18,
  yield: 36,
  ratio: 2,
  time: 24,
  temperature: 93,
  taste: 'sour',
  unstable: false,
  notes: 'Кислотность <стала> мягче',
  recommendation: recommendation(),
  ...overrides,
});

const session = (overrides = {}) => ({
  id: 'session-1',
  beanName: 'Бразилия / Серрадо <тест>',
  roastDate: '2026-07-28',
  roast: 'medium',
  dose: 18,
  canAdjustTemperature: true,
  starter: { dose: 18, yield: 36, ratio: 2, time: 25, temperature: 93 },
  status: 'active',
  createdAt: '2026-08-05T09:00:00.000Z',
  updatedAt: '2026-08-05T09:30:00.000Z',
  attempts: [attempt()],
  ...overrides,
});

assert.equal(normalizeRoastDate('2026-07-28'), '2026-07-28');
assert.equal(normalizeRoastDate('28.07.2026'), '2026-07-28');
assert.equal(normalizeRoastDate('2026-02-30'), null);
assert.equal(normalizeRoastDate('30.02.2026'), null);
assert.equal(normalizeRoastDate(''), null);
assert.equal(isFutureRoastDate('2026-08-06', new Date(2026, 7, 5, 12)), true);
assert.equal(isFutureRoastDate('2026-08-05', new Date(2026, 7, 5, 12)), false);
assert.equal(localIsoDate(new Date(2026, 7, 5, 12)), '2026-08-05');

assert.equal(sanitizeReportTitlePart('  Бразилия / тест:*?\n  '), 'Бразилия тест');
assert.equal(sanitizeReportTitlePart('abc\u202Efdp.exe\u2066'), 'abc fdp.exe');
assert.equal(sanitizeReportTitlePart('///'), 'Сессия');
assert.equal(sanitizeReportTitlePart('а'.repeat(120)).length, 80);

const snapshot = normalizeRecommendationSnapshot(recommendation({ targetRatio: 2.2, repeatable: false }));
assert.equal(snapshot.action, 'Увеличить выход по старой методике.');
assert.equal(snapshot.targetRatio, 2.2);
assert.equal(snapshot.repeatable, false);
assert.equal(normalizeRecommendationSnapshot({ kind: 'ratio-up', action: 'Нет заголовка' }), null);

const confirmedShot = attempt({ id: 'shot-2', recommendation: recommendation({ kind: 'complete' }) });
const confirmedSession = session({ status: 'completed', completedAt: '2026-08-05T10:00:00.000Z', attempts: [attempt(), confirmedShot] });
assert.equal(findConfirmedAttempt(confirmedSession), confirmedShot);
assert.deepEqual(summarizeReport([session(), confirmedSession]), {
  sessions: 2,
  attempts: 3,
  completed: 1,
  confirmed: 1,
});

const generatedAt = new Date(2026, 7, 5, 12, 0);
const single = buildReportDocument({
  sessions: [session({ attempts: [attempt(), attempt({ id: 'shot-missing', recommendation: null })] })],
  mode: 'session',
  logoDataUri: 'data:image/png;base64,TEST',
  generatedAt,
});
assert.equal(single.title, 'MBS - Журнал эспрессо - Бразилия Серрадо тест - 2026-08-05');
assert.match(single.html, /Московская школа бариста/);
assert.match(single.html, /https:\/\/baristaschool\.ru/);
assert.match(single.html, /data:image\/png;base64,TEST/);
assert.match(single.html, /Увеличить выход по старой методике/);
assert.match(single.html, /Рекомендация не зафиксирована/);
assert.match(single.html, /28 июля 2026/);
assert.ok(!single.html.includes('<тест>'));
assert.ok(single.html.includes('&lt;тест&gt;'));
assert.ok(single.html.includes('Кислотность &lt;стала&gt; мягче'));
assert.match(single.html, /grid-template-columns:128px minmax\(0,1fr\);gap:20px/);
assert.match(single.html, /\.ea-report-logo\{width:128px;height:38px/);
assert.match(single.html, /data-ea-report-print/);
assert.match(single.html, /window\.focus\(\);window\.print\(\)/);
assert.match(single.html, /-webkit-print-color-adjust:exact/);
assert.match(single.html, /\.ea-report-footer\{position:static;margin-top:8mm\}/);

const journal = buildReportDocument({ sessions: [session(), confirmedSession], mode: 'journal', generatedAt });
assert.equal(journal.title, 'MBS - Журнал эспрессо - Все сессии - 2026-08-05');
assert.match(journal.html, /ea-report-session--next/);
assert.match(journal.html, />3<\/strong><span>шотов/);
assert.match(journal.html, /Подтверждённый рецепт/);

const legacySession = session({ id: 'legacy', roastDate: undefined });
const legacyReport = buildReportDocument({ sessions: [legacySession], mode: 'session', generatedAt });
assert.match(legacyReport.html, /Дата обжарки<\/dt><dd>не указана/);
assert.ok(!buildReportDocument({ sessions: [session({ attempts: [attempt({ ratio: 2.2 })] })], mode: 'session', generatedAt }).html.includes('1:2,20'));

const maximumJournalSessions = Array.from({ length: 10 }, (_, sessionIndex) => session({
  id: `maximum-session-${sessionIndex}`,
  beanName: `Зерно ${sessionIndex + 1}`,
  attempts: Array.from({ length: 30 }, (_, attemptIndex) => attempt({
    id: `maximum-shot-${sessionIndex}-${attemptIndex}`,
    createdAt: new Date(Date.UTC(2026, 7, 5, 9, attemptIndex)).toISOString(),
  })),
}));
const maximumJournal = buildReportDocument({ sessions: maximumJournalSessions, mode: 'journal', generatedAt });
assert.deepEqual(summarizeReport(maximumJournalSessions), { sessions: 10, attempts: 300, completed: 0, confirmed: 0 });
assert.equal((maximumJournal.html.match(/class="ea-report-shot"/g) || []).length, 300);

console.log('report.test.mjs: passed');
