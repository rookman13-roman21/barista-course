#!/usr/bin/env node
'use strict';

/*
 * Собирает Tilda-ready HTML из утверждённого local preview.
 * В preview остаётся только демо-запись; production popup хранится отдельно
 * в tilda-blocks/09-online-booking-popup.html и использует общий виджет.
 */

const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const blocksDir = path.join(projectDir, 'tilda-blocks');
const sourceHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const sourceCss = fs.readFileSync(path.join(projectDir, 'styles.css'), 'utf8').trim();
const previewScript = fs.readFileSync(path.join(projectDir, 'preview.js'), 'utf8');

function between(source, start, end, label) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex === -1 || endIndex === -1) throw new Error(`Не удалось собрать ${label}: нет ожидаемой разметки`);
  return source.slice(startIndex + start.length, endIndex);
}

const mainContent = between(sourceHtml, '  <main class="mbs-ad-page">\n', '\n  </main>', 'основные блоки');
const programStart = mainContent.indexOf('    <section class="mbs-ad-program"');
if (programStart === -1) throw new Error('Не удалось найти начало блока программы');

const previewModalStart = sourceHtml.indexOf('  <div class="mbs-ad-modal"');
const lightboxStart = sourceHtml.indexOf('  <div class="mbs-ad-gallery-lightbox"');
const scriptStart = sourceHtml.indexOf('\n  <script src="preview.js');
if (previewModalStart === -1 || lightboxStart === -1 || scriptStart === -1 || lightboxStart < previewModalStart) {
  throw new Error('Не удалось отделить demo-запись от галереи');
}
const lightbox = sourceHtml.slice(lightboxStart, scriptStart).trim();

const runtimeStart = previewScript.indexOf("\n(function () {\n  'use strict';\n\n  document.querySelectorAll('.mbs-ad-faq__items')");
if (runtimeStart === -1) throw new Error('Не удалось отделить production-интерактив от demo-записи');
const productionRuntime = previewScript.slice(runtimeStart).trim();

const generatedNote = '<!-- Сгенерировано scripts/build-tilda-blocks.js из local preview. Не редактировать вручную. -->';
const sharedAssets = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">',
].join('\n');

function writeBlock(filename, content) {
  fs.writeFileSync(path.join(blocksDir, filename), `${generatedNote}\n${content.trim()}\n`, 'utf8');
}

writeBlock('01-hero-and-for-whom.html', `${sharedAssets}\n<style>\n${sourceCss}\n</style>\n<div class="mbs-ad-page">\n${mainContent.slice(0, programStart).trim()}\n</div>`);
writeBlock('02-course-content.html', `<div class="mbs-ad-page">\n${mainContent.slice(programStart).trim()}\n</div>\n${lightbox}`);
writeBlock('10-page-interactions.html', `<script>\n${productionRuntime}\n</script>`);

console.log('Tilda blocks generated: 01-hero-and-for-whom.html, 02-course-content.html, 10-page-interactions.html');
