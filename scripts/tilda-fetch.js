#!/usr/bin/env node
/**
 * tilda-fetch.js — скачивает HTML страниц с Tilda через API
 *
 * Использование:
 *   node scripts/tilda-fetch.js          — показать список всех страниц
 *   node scripts/tilda-fetch.js <pageid> — скачать конкретную страницу
 *   node scripts/tilda-fetch.js all      — скачать все страницы сразу
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Ключи Tilda API (читаются из .env или переменных окружения) ─────────────
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const PUBLIC_KEY  = process.env.TILDA_PUBLIC_KEY;
const SECRET_KEY  = process.env.TILDA_SECRET_KEY;
if (!PUBLIC_KEY || !SECRET_KEY) {
  console.error('Ошибка: TILDA_PUBLIC_KEY и TILDA_SECRET_KEY должны быть заданы в .env');
  process.exit(1);
}

// ─── Папки для страниц (tilda pageid → папка в проекте) ─────────────────────
const PAGE_MAP = {
  '62020373': 'prepay',               // /prepay
  '55192375': 'about-school',         // /company
  '141267956': 'home-barista-online', // /home_barista_online
  '59849743': 'bar-engineering',      // /bar_engineering
  '85842646': 'master-open',          // /master_open
  '34587578': 'calendar',             // /calendar
  '84318546': 'open-coffeeshop',      // /open_coffeeshop
  '65688259': 'capping',              // /capping
};

// ─── Утилиты ─────────────────────────────────────────────────────────────────
function apiGet(method, params = {}) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({
      publickey: PUBLIC_KEY,
      secretkey: SECRET_KEY,
      ...params,
    }).toString();

    const url = `https://api.tildacdn.info/v1/${method}/?${query}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'FOUND' || json.status === 'OK') {
            resolve(json.result);
          } else {
            reject(new Error(`API error: ${json.message || JSON.stringify(json)}`));
          }
        } catch (e) {
          reject(new Error('JSON parse error: ' + data.slice(0, 200)));
        }
      });
    }).on('error', reject);
  });
}

function saveFile(folder, filename, content) {
  const dir = path.join(__dirname, '..', folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  return filepath;
}

// ─── Команды ─────────────────────────────────────────────────────────────────
async function listPages() {
  console.log('Получаю список проектов...\n');
  const projects = await apiGet('getprojectslist');

  for (const project of projects) {
    console.log(`📁 Проект: ${project.title} (id: ${project.id})`);
    const pages = await apiGet('getpageslist', { projectid: project.id });

    for (const page of pages) {
      const mapped = PAGE_MAP[page.id] ? ` → ${PAGE_MAP[page.id]}/` : ' ← добавь в PAGE_MAP';
      console.log(`   📄 [${page.id}] ${page.title} | /${page.alias}${mapped}`);
    }
    console.log();
  }

  console.log('──────────────────────────────────────────────');
  console.log('Скачать страницу:  node scripts/tilda-fetch.js <pageid>');
  console.log('Скачать все:       node scripts/tilda-fetch.js all');
}

async function fetchPage(pageId) {
  console.log(`Скачиваю страницу ${pageId}...`);
  const page = await apiGet('getpagefull', { pageid: pageId });

  const folder = PAGE_MAP[pageId];
  if (!folder) {
    console.log(`\n⚠️  pageid ${pageId} не найден в PAGE_MAP.`);
    console.log('Добавь строку в PAGE_MAP внутри scripts/tilda-fetch.js:');
    console.log(`  '${pageId}': 'название-папки',\n`);
    // Всё равно сохраним рядом со скриптом как временный файл
    const tmp = saveFile('scripts/_temp', `page-${pageId}.html`, page.html || '');
    console.log(`Временно сохранил: ${tmp}`);
    return;
  }

  const filepath = saveFile(folder, 'tilda-source.html', page.html || '');
  console.log(`✅ Сохранено: ${filepath}`);
  console.log(`   Заголовок: ${page.title}`);
  console.log(`   Alias:     /${page.alias}`);
}

async function fetchAll() {
  const projects = await apiGet('getprojectslist');
  for (const project of projects) {
    const pages = await apiGet('getpageslist', { projectid: project.id });
    for (const page of pages) {
      if (PAGE_MAP[page.id]) {
        await fetchPage(page.id);
      }
    }
  }
  console.log('\nГотово.');
}

// ─── Точка входа ─────────────────────────────────────────────────────────────
(async () => {
  const arg = process.argv[2];
  try {
    if (!arg) {
      await listPages();
    } else if (arg === 'all') {
      await fetchAll();
    } else {
      await fetchPage(arg);
    }
  } catch (e) {
    console.error('Ошибка:', e.message);
    process.exit(1);
  }
})();
