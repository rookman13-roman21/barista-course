import { ROAST_PRESETS, TASTE_OPTIONS } from './rules.js';
import {
  REPORT_SCHOOL_NAME,
  REPORT_SCHOOL_URL,
  findConfirmedAttempt,
  formatReportDateOnly,
  formatReportDateTime,
  formatReportNumber,
  localIsoDate,
  normalizeRecommendationSnapshot,
  sanitizeReportTitlePart,
  summarizeReport,
} from './report.js';

const PAGE_WIDTH = 1684;
const PAGE_HEIGHT = 1190;
const PDF_WIDTH = 842;
const PDF_HEIGHT = 595;
const PAGE_MARGIN = 70;
const CONTENT_BOTTOM = 1090;
const COLORS = Object.freeze({
  ink: '#1f2920',
  green: '#417033',
  greenLight: '#e7f2e3',
  greenBorder: '#c9ddc4',
  muted: '#667166',
  red: '#cc2841',
  redLight: '#f8dde1',
  line: '#d8e2d5',
  detail: '#f5f5f5',
  white: '#ffffff',
});

function asText(value) {
  return String(value ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function font(size, weight = 400) {
  return `${weight} ${size}px Arial, Helvetica, sans-serif`;
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke = '') {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function wrapLines(ctx, value, maxWidth) {
  const text = asText(value) || '—';
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      return;
    }
    lines.push(line);
    if (ctx.measureText(word).width <= maxWidth) {
      line = word;
      return;
    }
    let fragment = '';
    Array.from(word).forEach((character) => {
      const next = fragment + character;
      if (fragment && ctx.measureText(next).width > maxWidth) {
        lines.push(fragment);
        fragment = character;
      } else {
        fragment = next;
      }
    });
    line = fragment;
  });
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx, lines, x, y, lineHeight, maxLines = lines.length) {
  lines.slice(0, maxLines).forEach((line, index) => ctx.fillText(line, x, y + (index * lineHeight)));
  return y + (Math.min(lines.length, maxLines) * lineHeight);
}

function createPage() {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas is not available');
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  ctx.textBaseline = 'top';
  ctx.fillStyle = COLORS.ink;
  return { canvas, ctx, y: PAGE_MARGIN };
}

function loadImage(dataUri) {
  return new Promise((resolve) => {
    if (!dataUri) {
      resolve(null);
      return;
    }
    const image = new Image();
    image.onload = () => {
      const probe = document.createElement('canvas');
      probe.width = image.naturalWidth;
      probe.height = image.naturalHeight;
      const probeContext = probe.getContext('2d');
      if (!probeContext) {
        resolve({ image, bounds: { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight } });
        return;
      }
      probeContext.drawImage(image, 0, 0);
      const pixels = probeContext.getImageData(0, 0, probe.width, probe.height).data;
      let left = probe.width;
      let top = probe.height;
      let right = -1;
      let bottom = -1;
      for (let y = 0; y < probe.height; y += 1) {
        for (let x = 0; x < probe.width; x += 1) {
          const offset = ((y * probe.width) + x) * 4;
          if (pixels[offset + 3] > 16 && (pixels[offset] < 245 || pixels[offset + 1] < 245 || pixels[offset + 2] < 245)) {
            left = Math.min(left, x);
            top = Math.min(top, y);
            right = Math.max(right, x);
            bottom = Math.max(bottom, y);
          }
        }
      }
      const bounds = right >= left && bottom >= top
        ? { x: left, y: top, width: right - left + 1, height: bottom - top + 1 }
        : { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
      resolve({ image, bounds });
    };
    image.onerror = () => resolve(null);
    image.src = dataUri;
  });
}

function drawLogo(ctx, logo, x, y, width = 190, height = 62) {
  if (logo?.image && logo?.bounds) {
    const scale = Math.min(width / logo.bounds.width, height / logo.bounds.height);
    const drawWidth = logo.bounds.width * scale;
    const drawHeight = logo.bounds.height * scale;
    ctx.drawImage(
      logo.image,
      logo.bounds.x,
      logo.bounds.y,
      logo.bounds.width,
      logo.bounds.height,
      x,
      y + ((height - drawHeight) / 2),
      drawWidth,
      drawHeight,
    );
    return;
  }
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(46, 700);
  ctx.fillText('MBS*', x, y + 7);
}

function drawFullHeader(page, logo, generatedAt) {
  const { ctx } = page;
  drawLogo(ctx, logo, PAGE_MARGIN, PAGE_MARGIN, 190, 62);
  const titleX = PAGE_MARGIN + 230;
  ctx.fillStyle = COLORS.green;
  ctx.font = font(18, 800);
  ctx.fillText(REPORT_SCHOOL_NAME.toUpperCase(), titleX, PAGE_MARGIN + 2);
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(42, 800);
  ctx.fillText('Журнал настройки эспрессо', titleX, PAGE_MARGIN + 26);
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(22, 700);
  ctx.textAlign = 'right';
  ctx.fillText('baristaschool.ru', PAGE_WIDTH - PAGE_MARGIN, PAGE_MARGIN + 28);
  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(PAGE_MARGIN, PAGE_MARGIN + 83, PAGE_WIDTH - (PAGE_MARGIN * 2), 5);
  ctx.fillStyle = COLORS.muted;
  ctx.font = font(18, 400);
  ctx.fillText(`Сформирован ${formatReportDateTime(generatedAt)}`, PAGE_MARGIN, PAGE_MARGIN + 105);
  page.y = PAGE_MARGIN + 146;
}

function drawCompactHeader(page, logo, sessionName) {
  const { ctx } = page;
  drawLogo(ctx, logo, PAGE_MARGIN, PAGE_MARGIN, 128, 42);
  ctx.fillStyle = COLORS.green;
  ctx.font = font(16, 800);
  ctx.fillText(REPORT_SCHOOL_NAME.toUpperCase(), PAGE_MARGIN + 160, PAGE_MARGIN + 1);
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(25, 800);
  ctx.fillText(`Журнал эспрессо · ${asText(sessionName)}`, PAGE_MARGIN + 160, PAGE_MARGIN + 21);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(PAGE_MARGIN, PAGE_MARGIN + 60, PAGE_WIDTH - (PAGE_MARGIN * 2), 3);
  page.y = PAGE_MARGIN + 84;
}

function drawSummary(page, summary) {
  const { ctx } = page;
  const gap = 14;
  const width = (PAGE_WIDTH - (PAGE_MARGIN * 2) - (gap * 3)) / 4;
  const items = [
    [summary.sessions, 'сессий'],
    [summary.attempts, 'шотов'],
    [summary.completed, 'завершено'],
    [summary.confirmed, 'повторяемость подтверждена'],
  ];
  items.forEach(([value, label], index) => {
    const x = PAGE_MARGIN + (index * (width + gap));
    roundedRect(ctx, x, page.y, width, 88, 18, COLORS.greenLight);
    ctx.fillStyle = COLORS.ink;
    ctx.font = font(32, 800);
    ctx.fillText(String(value), x + 20, page.y + 14);
    ctx.fillStyle = COLORS.muted;
    ctx.font = font(15, 400);
    ctx.fillText(label, x + 20, page.y + 57);
  });
  page.y += 112;
}

function drawSessionHeading(page, session, index, continuation = false) {
  const { ctx } = page;
  const status = session.status === 'completed' ? 'ЗАВЕРШЕНА' : 'В РАБОТЕ';
  ctx.fillStyle = COLORS.green;
  ctx.font = font(16, 800);
  ctx.fillText(`СЕССИЯ ${index + 1}${continuation ? ' · ПРОДОЛЖЕНИЕ' : ''}`, PAGE_MARGIN, page.y);
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(36, 800);
  const nameLines = wrapLines(ctx, session.beanName || 'Без названия', 1050).slice(0, 2);
  drawLines(ctx, nameLines, PAGE_MARGIN, page.y + 25, 42);
  roundedRect(ctx, PAGE_WIDTH - PAGE_MARGIN - 170, page.y + 12, 170, 40, 20, COLORS.redLight);
  ctx.fillStyle = COLORS.red;
  ctx.font = font(15, 800);
  ctx.textAlign = 'center';
  ctx.fillText(status, PAGE_WIDTH - PAGE_MARGIN - 85, page.y + 23);
  ctx.textAlign = 'left';
  page.y += 25 + (nameLines.length * 42) + 18;
}

function drawMeta(page, session) {
  const { ctx } = page;
  const attempts = Array.isArray(session.attempts) ? session.attempts : [];
  const roast = ROAST_PRESETS[session.roast] || ROAST_PRESETS.unknown;
  const confirmed = findConfirmedAttempt(session);
  const values = [
    ['Обжарка', roast.label],
    ['Дата обжарки', formatReportDateOnly(session.roastDate)],
    ['Начало', formatReportDateTime(session.createdAt)],
    ['Завершение', session.status === 'completed' ? formatReportDateTime(session.completedAt) : '—'],
    ['Шотов', attempts.length],
    ['Повторяемость', confirmed ? 'Подтверждена' : 'Не подтверждена'],
  ];
  const gap = 12;
  const width = (PAGE_WIDTH - (PAGE_MARGIN * 2) - (gap * 2)) / 3;
  values.forEach(([label, value], index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = PAGE_MARGIN + (column * (width + gap));
    const y = page.y + (row * 76);
    roundedRect(ctx, x, y, width, 64, 12, COLORS.white, COLORS.line);
    ctx.fillStyle = COLORS.muted;
    ctx.font = font(13, 400);
    ctx.fillText(label, x + 15, y + 10);
    ctx.fillStyle = COLORS.ink;
    ctx.font = font(16, 700);
    const lines = wrapLines(ctx, value, width - 30).slice(0, 2);
    drawLines(ctx, lines, x + 15, y + 31, 18);
  });
  page.y += 164;
}

function recipeText(session, attempt) {
  if (!attempt) return ['Нет сохранённых шотов', ''];
  const temperature = session.canAdjustTemperature && attempt.temperature !== null
    ? `${formatReportNumber(attempt.temperature)} °C`
    : 'температура не отслеживается';
  return [
    `${formatReportNumber(attempt.dose)} г → ${formatReportNumber(attempt.yield)} г · 1:${formatReportNumber(attempt.ratio, 2)}`,
    `${formatReportNumber(attempt.time)} с · ${temperature}`,
  ];
}

function drawRecipes(page, session) {
  const { ctx } = page;
  const attempts = Array.isArray(session.attempts) ? session.attempts : [];
  const confirmed = findConfirmedAttempt(session);
  const result = confirmed || attempts[attempts.length - 1] || null;
  const starter = session.starter || {};
  const starterTemperature = session.canAdjustTemperature
    ? `${formatReportNumber(starter.temperature)} °C`
    : 'температура не меняется';
  const cards = [
    ['Базовый рецепт', `${formatReportNumber(starter.dose)} г → ${formatReportNumber(starter.yield)} г · 1:${formatReportNumber(starter.ratio, 2)}`, `${formatReportNumber(starter.time)} с · ${starterTemperature}`],
    [confirmed ? 'Подтверждённый рецепт' : 'Последний шот', ...recipeText(session, result)],
  ];
  const gap = 14;
  const width = (PAGE_WIDTH - (PAGE_MARGIN * 2) - gap) / 2;
  cards.forEach(([label, main, extra], index) => {
    const x = PAGE_MARGIN + (index * (width + gap));
    roundedRect(ctx, x, page.y, width, 86, 14, COLORS.greenLight);
    ctx.fillStyle = COLORS.muted;
    ctx.font = font(13, 400);
    ctx.fillText(label, x + 18, page.y + 12);
    ctx.fillStyle = COLORS.ink;
    ctx.font = font(20, 800);
    ctx.fillText(main, x + 18, page.y + 34);
    ctx.fillStyle = COLORS.muted;
    ctx.font = font(13, 400);
    ctx.fillText(extra, x + 18, page.y + 61);
  });
  page.y += 106;
}

const TABLE_COLUMNS = Object.freeze([
  { label: '№ / дата', width: 190 },
  { label: 'Доза', width: 110 },
  { label: 'Выход', width: 120 },
  { label: 'Коэфф.', width: 110 },
  { label: 'Время', width: 110 },
  { label: 'Темп.', width: 110 },
  { label: 'Вкус', width: 604 },
  { label: 'Пролив', width: 190 },
]);

function drawTableHeader(page) {
  const { ctx } = page;
  let x = PAGE_MARGIN;
  TABLE_COLUMNS.forEach((column) => {
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(x, page.y, column.width, 44);
    ctx.fillStyle = COLORS.white;
    ctx.font = font(14, 700);
    ctx.fillText(column.label, x + 10, page.y + 13);
    x += column.width;
  });
  page.y += 44;
}

function attemptLayout(ctx, attempt, session, index) {
  const recommendation = normalizeRecommendationSnapshot(attempt.recommendation);
  const recommendationText = recommendation
    ? `${recommendation.title}. ${recommendation.action}`
    : 'Рекомендация не зафиксирована';
  const noteText = attempt.notes ? asText(attempt.notes) : '—';
  ctx.font = font(14, 400);
  const taste = TASTE_OPTIONS[attempt.taste] || attempt.taste || '—';
  const tasteLines = wrapLines(ctx, taste, TABLE_COLUMNS[6].width - 20);
  const mainHeight = Math.max(58, 20 + (tasteLines.length * 18));
  ctx.font = font(13, 400);
  const detailLines = wrapLines(ctx, `Следующее действие: ${recommendationText}   Заметка: ${noteText}`, PAGE_WIDTH - (PAGE_MARGIN * 2) - 24);
  const detailHeight = Math.max(45, 18 + (detailLines.length * 17));
  const temperature = session.canAdjustTemperature && attempt.temperature !== null
    ? `${formatReportNumber(attempt.temperature)} °C`
    : '—';
  return {
    mainHeight,
    detailHeight,
    detailLines,
    cells: [
      [`${index + 1}`, formatReportDateTime(attempt.createdAt)],
      [`${formatReportNumber(attempt.dose)} г`],
      [`${formatReportNumber(attempt.yield)} г`],
      [`1:${formatReportNumber(attempt.ratio, 2)}`],
      [`${formatReportNumber(attempt.time)} с`],
      [temperature],
      tasteLines,
      [attempt.unstable ? 'Неровный' : 'Без отметки'],
    ],
  };
}

function drawAttempt(page, layout) {
  const { ctx } = page;
  let x = PAGE_MARGIN;
  layout.cells.forEach((lines, index) => {
    const width = TABLE_COLUMNS[index].width;
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x, page.y, width, layout.mainHeight);
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, page.y, width, layout.mainHeight);
    ctx.fillStyle = COLORS.ink;
    ctx.font = font(index === 0 ? 14 : 13, index === 0 ? 700 : 400);
    const safeLines = Array.isArray(lines) ? lines : [lines];
    safeLines.forEach((line, lineIndex) => {
      if (lineIndex === 1 && index === 0) {
        ctx.fillStyle = COLORS.muted;
        ctx.font = font(11, 400);
      }
      ctx.fillText(line, x + 9, page.y + 10 + (lineIndex * 18));
    });
    x += width;
  });
  page.y += layout.mainHeight;
  ctx.fillStyle = COLORS.detail;
  ctx.fillRect(PAGE_MARGIN, page.y, PAGE_WIDTH - (PAGE_MARGIN * 2), layout.detailHeight);
  ctx.strokeStyle = COLORS.line;
  ctx.strokeRect(PAGE_MARGIN, page.y, PAGE_WIDTH - (PAGE_MARGIN * 2), layout.detailHeight);
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(13, 400);
  drawLines(ctx, layout.detailLines, PAGE_MARGIN + 12, page.y + 10, 17);
  page.y += layout.detailHeight;
}

function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function concatBytes(chunks) {
  const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

export function assembleImagePdf(images, { pageWidth = PDF_WIDTH, pageHeight = PDF_HEIGHT } = {}) {
  if (!Array.isArray(images) || !images.length) throw new Error('At least one PDF page is required');
  const encoder = new TextEncoder();
  const chunks = [];
  const offsets = [0];
  let byteLength = 0;
  const push = (bytes) => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };
  const pushText = (value) => push(encoder.encode(value));
  const addObject = (id, body, stream = null) => {
    offsets[id] = byteLength;
    pushText(`${id} 0 obj\n${body}`);
    if (stream) {
      pushText('\nstream\n');
      push(stream);
      pushText('\nendstream');
    }
    pushText('\nendobj\n');
  };

  push(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10]));
  const pageIds = images.map((_, index) => 3 + (index * 3));
  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObject(2, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${images.length} >>`);

  images.forEach((image, index) => {
    const pageId = pageIds[index];
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const imageName = `Im${index + 1}`;
    const content = encoder.encode(`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/${imageName} Do\nQ\n`);
    addObject(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    addObject(imageId, `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>`, image.bytes);
    addObject(contentId, `<< /Length ${content.length} >>`, content);
  });

  const xrefOffset = byteLength;
  const objectCount = 2 + (images.length * 3);
  pushText(`xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`);
  for (let id = 1; id <= objectCount; id += 1) {
    pushText(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  pushText(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  return concatBytes(chunks);
}

function addFooter(page, pageNumber, pageCount) {
  const { ctx } = page;
  ctx.fillStyle = COLORS.muted;
  ctx.font = font(12, 400);
  ctx.textAlign = 'center';
  ctx.fillText(`${REPORT_SCHOOL_NAME} · baristaschool.ru`, PAGE_WIDTH / 2, PAGE_HEIGHT - 44);
  ctx.textAlign = 'right';
  ctx.fillText(`${pageNumber} / ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, PAGE_HEIGHT - 44);
  ctx.textAlign = 'left';
}

export async function buildReportPdf({ sessions = [], mode = 'journal', logoDataUri = '', generatedAt = new Date() } = {}) {
  const safeSessions = Array.isArray(sessions) ? sessions.filter((session) => Array.isArray(session.attempts) && session.attempts.length) : [];
  if (!safeSessions.length) throw new Error('No sessions with attempts');
  const logo = await loadImage(logoDataUri);
  const summary = summarizeReport(safeSessions);
  const pages = [];

  safeSessions.forEach((session, sessionIndex) => {
    let page = createPage();
    pages.push(page);
    if (sessionIndex === 0) {
      drawFullHeader(page, logo, generatedAt);
      drawSummary(page, summary);
    } else {
      drawCompactHeader(page, logo, session.beanName);
    }
    drawSessionHeading(page, session, sessionIndex);
    drawMeta(page, session);
    drawRecipes(page, session);
    drawTableHeader(page);

    session.attempts.forEach((attempt, attemptIndex) => {
      const layout = attemptLayout(page.ctx, attempt, session, attemptIndex);
      if (page.y + layout.mainHeight + layout.detailHeight > CONTENT_BOTTOM) {
        page = createPage();
        pages.push(page);
        drawCompactHeader(page, logo, session.beanName);
        drawSessionHeading(page, session, sessionIndex, true);
        drawTableHeader(page);
      }
      drawAttempt(page, layout);
    });
  });

  const images = pages.map((page, index) => {
    addFooter(page, index + 1, pages.length);
    return {
      bytes: dataUrlBytes(page.canvas.toDataURL('image/jpeg', 0.94)),
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    };
  });
  const pdfBytes = assembleImagePdf(images);
  const titlePart = mode === 'session' && safeSessions[0]
    ? sanitizeReportTitlePart(safeSessions[0].beanName)
    : 'Все сессии';
  const title = `MBS - Журнал эспрессо - ${titlePart} - ${localIsoDate(generatedAt)}`;
  return {
    title,
    filename: `${title}.pdf`,
    blob: new Blob([pdfBytes], { type: 'application/pdf' }),
    bytes: pdfBytes,
    pageCount: pages.length,
  };
}
