import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(projectRoot, file), 'utf8');
const [preview, tildaBlock, markup] = await Promise.all([
  read('index.html'),
  read('tilda-block.html'),
  read('src/markup.html'),
]);

const viewerUrl = 'https://drawings.barista-school.ru/s/hjnAVgbSG8yDvrlCC8vNrb7D4xuywMKeWvVzks_8ixk';

assert.equal((preview.match(/<h1\b/gi) || []).length, 1, 'Local preview must contain one H1');
assert.equal((tildaBlock.match(/<h1\b/gi) || []).length, 1, 'Tilda block must contain one H1');
assert.equal((markup.match(/<details>/g) || []).length, 3, 'FAQ must contain three questions');
assert.ok(markup.includes(viewerUrl), 'Article must link to the approved Viewer material');
assert.equal((markup.match(/rel="noopener noreferrer"/g) || []).length, 4, 'Every Viewer link must isolate the new tab');
assert.ok(markup.includes('https://baristaschool.ru/bar_engineering#cases'), 'Article must link to the cases section');
assert.ok(markup.includes('https://baristaschool.ru/bar_engineering'), 'Article must link to the service page');
assert.ok(!/<iframe\b/i.test(markup), 'Viewer must not be embedded in an iframe');
assert.ok(!/\bfetch\s*\(/.test(tildaBlock), 'Static Tilda article must not make external runtime requests');
assert.ok(preview.includes('__2026-08-02_172739.png'), 'Preview must retain the approved cover image');

console.log('structure.test.mjs: passed');
