import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(projectRoot, file), 'utf8');
const [preview, tildaBlock, markup, styles] = await Promise.all([
  read('index.html'),
  read('tilda-block.html'),
  read('src/markup.html'),
  read('src/styles.css'),
]);

const viewerUrl = 'https://drawings.barista-school.ru/s/hjnAVgbSG8yDvrlCC8vNrb7D4xuywMKeWvVzks_8ixk';

assert.equal((preview.match(/<h1\b/gi) || []).length, 1, 'Local preview must contain one H1');
assert.equal((tildaBlock.match(/<h1\b/gi) || []).length, 1, 'Tilda block must contain one H1');
assert.equal((markup.match(/<details>/g) || []).length, 4, 'FAQ must contain four questions');
assert.equal((markup.match(/mbs-workplace__check-item/g) || []).length, 4, 'Checklist must contain four practical parameters');
assert.ok(markup.includes(viewerUrl), 'Article must link to the approved Viewer material');
assert.equal((markup.match(/rel="noopener noreferrer"/g) || []).length, 3, 'Every Viewer link must isolate the new tab');
assert.ok(markup.includes('https://baristaschool.ru/bar_engineering#cases'), 'Article must link to the cases section');
assert.ok(markup.includes('https://baristaschool.ru/bar_engineering'), 'Article must link to the service page');
assert.ok(markup.includes('Поможете организовать рабочее место бариста?'), 'FAQ must explain the workplace design service');
assert.ok(markup.includes('техническое задание для мебельщика'), 'FAQ must explain the deliverable for furniture production');
assert.ok(markup.includes("addEventListener('toggle'"), 'FAQ must close previous answers when a new one opens');
assert.ok(markup.includes('items[j].open = false'), 'FAQ must enforce one open answer at a time');
assert.ok(!/<iframe\b/i.test(markup), 'Viewer must not be embedded in an iframe');
assert.ok(!markup.includes('mbs-workplace__material'), 'Viewer material must be introduced in the hero, not a separate block');
assert.ok(!/\bfetch\s*\(/.test(tildaBlock), 'Static Tilda article must not make external runtime requests');
assert.ok(preview.includes('__2026-08-02_172739.png'), 'Preview must retain the approved cover image');
for (const topic of ['канализации', '900 мм', '750 мм', '800 мм', '700 мм', 'нок-бокс', 'ринзер', '100 чеков в день', '380 В', '220 В']) {
  assert.ok(markup.includes(topic), `Article must retain the dictated topic: ${topic}`);
}
assert.ok(preview.includes('@phosphor-icons/web@2.1.1'), 'Preview must load the approved icon library');
assert.ok(styles.includes('max-width: 1100px'), 'Standard content width must match the design system');
assert.ok(styles.includes('font-size: 82px'), 'Desktop hero title must match the design system');
assert.ok(styles.includes('@media (max-width: 420px)'), 'Hero must include the 420px title breakpoint');
assert.ok(styles.includes('font-size: 34px'), 'Hero title must be 34px at the smallest breakpoint');
assert.ok(styles.includes('height: 267px'), 'Hero image must have the 820px mobile height');
assert.ok(styles.includes('height: 300px'), 'Hero image must have the 420px mobile height');
assert.ok(styles.includes('.mbs-workplace__lead--mobile {\n    display: block;'), 'Mobile hero lead must follow the image');
assert.ok(styles.includes('background: var(--mbs-bg-green);'), 'Final CTA must use the light-green design-system card');

const faqScript = markup.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*$/);
assert.ok(faqScript, 'FAQ must include a self-contained interaction script');

const fakeItems = Array.from({ length: 4 }, () => ({
  open: false,
  handlers: {},
  addEventListener(type, handler) {
    this.handlers[type] = handler;
  },
}));

const fakeRoot = {
  attributes: new Map(),
  getAttribute(name) {
    return this.attributes.get(name) || null;
  },
  setAttribute(name, value) {
    this.attributes.set(name, value);
  },
  querySelectorAll(selector) {
    assert.equal(selector, '.mbs-workplace__faq details');
    return fakeItems;
  },
};

vm.runInNewContext(faqScript[1], {
  document: {
    querySelector(selector) {
      assert.equal(selector, '[data-mbs-workplace-root]');
      return fakeRoot;
    },
  },
});

fakeItems[0].open = true;
fakeItems[0].handlers.toggle.call(fakeItems[0]);
fakeItems[1].open = true;
fakeItems[1].handlers.toggle.call(fakeItems[1]);
assert.equal(fakeItems[0].open, false, 'Opening the next FAQ answer must close the previous one');
assert.equal(fakeItems[1].open, true, 'The newly opened FAQ answer must stay open');

console.log('structure.test.mjs: passed');
