#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const blocksDir = path.join(projectDir, 'tilda-blocks');
const sourceHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const sourceCss = fs.readFileSync(path.join(projectDir, 'styles.css'), 'utf8').trim();
const sharedCss = fs.readFileSync(path.join(projectDir, '..', 'advanced-barista', 'styles.css'), 'utf8').trim();
const previewScript = fs.readFileSync(path.join(projectDir, 'preview.js'), 'utf8');
const popupTemplate = fs.readFileSync(
  path.join(projectDir, '..', 'advanced-barista', 'tilda-blocks', '09-online-booking-popup.html'),
  'utf8'
);

const localCssImport = '@import url("../advanced-barista/styles.css");';
if (!sourceCss.includes(localCssImport)) {
  throw new Error('Не удалось встроить общую CSS-базу advanced-barista');
}
const tildaCss = sourceCss.replace(localCssImport, sharedCss);

function between(source, start, end, label) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex === -1 || endIndex === -1) throw new Error(`Не найден блок: ${label}`);
  return source.slice(startIndex + start.length, endIndex).trim();
}

function writeBlock(filename, content) {
  fs.writeFileSync(path.join(blocksDir, filename), `<!-- Сгенерировано scripts/build-tilda-blocks.js. Не редактировать вручную. -->\n${content.trim()}\n`, 'utf8');
}

const assets = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">'
].join('\n');

const hero = between(sourceHtml, '<!-- tilda:hero-start -->', '<!-- tilda:hero-end -->', 'hero');
const content = between(sourceHtml, '<!-- tilda:content-start -->', '<!-- tilda:content-end -->', 'content');
const runtime = between(previewScript, '/* production-runtime:start */', '/* production-runtime:end */', 'production runtime');

const lightboxStart = sourceHtml.indexOf('  <div class="mbs-ad-gallery-lightbox"');
const scriptStart = sourceHtml.indexOf('\n  <script src="preview.js');
if (lightboxStart === -1 || scriptStart === -1 || lightboxStart > scriptStart) {
  throw new Error('Не найдена разметка просмотра галереи');
}
const lightbox = sourceHtml.slice(lightboxStart, scriptStart).trim();

const bookingPopup = popupTemplate
  .replaceAll('mbs-bc-booking', 'mbs-pr-booking')
  .replaceAll('Продвинутый курс бариста', 'Профессиональный курс бариста')
  .replaceAll('продвинутый курс бариста', 'профессиональный курс бариста')
  .replaceAll('advanced-barista-20260819', 'professional-barista-20260822')
  .replaceAll('advanced-barista', 'professional-barista');

writeBlock('01-hero-and-for-whom.html', `${assets}\n<style>\n${tildaCss}\n</style>\n<div class="mbs-ad-page">\n${hero}\n</div>`);
writeBlock('02-course-content.html', `<div class="mbs-ad-page">\n${content}\n</div>\n${lightbox}`);
writeBlock('09-online-booking-popup.html', bookingPopup);
writeBlock('10-page-interactions.html', `<script>\n${runtime}\n</script>`);
console.log('Tilda blocks generated: 01-hero-and-for-whom.html, 02-course-content.html, 09-online-booking-popup.html, 10-page-interactions.html');
