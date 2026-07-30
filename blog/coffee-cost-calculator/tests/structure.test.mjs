import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archive = await readFile(path.join(projectRoot, 'tilda-block.html'), 'utf8');
const hosted = await readFile(path.join(projectRoot, 'hosted', 'coffee-cost-calculator.html'), 'utf8');
const loader = await readFile(path.join(projectRoot, 'tilda-loader.html'), 'utf8');
const tildaSeoBlock = await readFile(path.join(projectRoot, 'tilda-seo-block.html'), 'utf8');
const preview = await readFile(path.join(projectRoot, 'index.html'), 'utf8');
const markup = await readFile(path.join(projectRoot, 'src', 'markup.html'), 'utf8');

assert.equal((preview.match(/<h1\b/gi) || []).length, 1, 'The local preview must contain one H1');
assert.equal((markup.match(/<details>/g) || []).length, 2, 'The FAQ must contain only two questions');
assert.ok(!markup.includes('Куда сохраняются мои цены?'), 'The local-storage FAQ question must not be published');
assert.ok(markup.includes('https://baristaschool.ru/open_cafe_app'), 'The recipe FAQ must link to MBS* Coffee Menu');
assert.ok(!markup.includes('Сохранение происходит только в вашем браузере'), 'The local-storage explanation must not be shown');
assert.ok(!markup.includes('Одна цена ингредиента применяется ко всем напиткам'), 'The shared-price explanation must not be shown');
assert.ok(markup.includes('data-reset-current hidden'), 'The reset action must be hidden before a user changes an ingredient setting');

assert.equal((tildaSeoBlock.match(/<h1\b/gi) || []).length, 1, 'The static Tilda SEO block must contain one H1');
assert.equal((tildaSeoBlock.match(/<details>/g) || []).length, 2, 'The static Tilda SEO block must contain the two FAQ questions');
assert.ok(tildaSeoBlock.includes('data-mbs-costcalc-loader-slot'), 'The static Tilda SEO block reserves the calculator position');
assert.ok(tildaSeoBlock.includes('https://baristaschool.ru/open_cafe_app'), 'The static Tilda SEO block retains the Coffee Menu link');
assert.ok(tildaSeoBlock.includes('href="#consalt"'), 'The static Tilda SEO block retains the Mixology CTA');
assert.equal((tildaSeoBlock.match(/id=["']consalt["']/gi) || []).length, 0, 'The static Tilda SEO block must not shadow the Tilda popup anchor');
assert.ok(!tildaSeoBlock.includes('data-mbs-costcalc-root'), 'The static Tilda SEO block must not initialise the calculator twice');

assert.equal((hosted.match(/<h1\b/gi) || []).length, 0, 'Hosted calculator must not duplicate the native Tilda H1');
assert.equal((hosted.match(/id=["']consalt["']/gi) || []).length, 0, 'Hosted calculator must not shadow the Tilda popup anchor');
assert.ok(hosted.includes('data-mbs-costcalc-hosted="v1"'), 'Hosted calculator has a validation marker');
assert.ok(hosted.includes('mbsCostCalc:v1:prices'), 'Hosted calculator keeps namespaced price storage');
assert.ok(hosted.includes('mbsCostCalc:v1:selection'), 'Hosted calculator keeps namespaced selection storage');
assert.ok(!/\bfetch\s*\(/.test(hosted), 'Hosted calculator must not call external APIs');
assert.ok(!/src\/(data|calc|app)\.js/.test(hosted), 'Hosted calculator must be self-contained');

assert.ok(loader.includes('https://api.barista-school.ru/api/coffee-cost-calculator.html'), 'Loader targets the hosted calculator URL');
assert.ok(loader.includes('AbortController'), 'Loader aborts a slow request');
assert.ok(loader.includes('runScripts'), 'Loader re-runs scripts from hosted HTML');
assert.ok(loader.includes('data-mbs-costcalc-hosted="v1"'), 'Loader validates the hosted calculator marker');
assert.ok(loader.includes('data-mbs-costcalc-loader-slot'), 'Loader places the calculator between the SEO sections');
assert.equal((loader.match(/<h1\b/gi) || []).length, 0, 'Loader must not duplicate the native Tilda H1');
assert.equal((loader.match(/id=["']consalt["']/gi) || []).length, 0, 'Loader must not shadow the Tilda popup anchor');
assert.ok(archive.includes('local full-page archive'), 'The old full block is clearly marked as an archive');
assert.ok(preview.includes('<title>Калькулятор себестоимости кофейных напитков'), 'Preview has a page title');

const hostedInlineScript = hosted.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
const loaderInlineScript = loader.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
const tildaSeoInlineScript = tildaSeoBlock.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
assert.ok(hostedInlineScript, 'Hosted calculator must contain an inline script');
assert.ok(loaderInlineScript, 'Loader must contain an inline script');
assert.ok(tildaSeoInlineScript, 'Static Tilda SEO block must contain its FAQ script');
assert.doesNotThrow(() => new Function(hostedInlineScript), 'Hosted calculator inline script must parse');
assert.doesNotThrow(() => new Function(loaderInlineScript), 'Loader inline script must parse');
assert.doesNotThrow(() => new Function(tildaSeoInlineScript), 'Static Tilda SEO inline script must parse');

console.log('structure.test.mjs: passed');
