import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(projectRoot, file), 'utf8');
const [preview, seo, hosted, loader, archive, seoSource] = await Promise.all([
  read('index.html'),
  read('tilda-seo-block.html'),
  read('hosted/espresso-assistant.html'),
  read('tilda-loader.html'),
  read('tilda-block.html'),
  read('src/seo-markup.html'),
]);

assert.equal((preview.match(/<h1\b/gi) || []).length, 1, 'Preview must contain one H1');
assert.equal((seo.match(/<h1\b/gi) || []).length, 1, 'Static Tilda block must contain one H1');
assert.equal((hosted.match(/<h1\b/gi) || []).length, 0, 'Hosted helper must not duplicate the H1');
assert.equal((loader.match(/<h1\b/gi) || []).length, 0, 'Loader must not duplicate the H1');

assert.ok(seo.includes('data-mbs-espresso-assistant-loader-slot'), 'Static block reserves the helper position');
assert.ok(seo.includes('"@type": "WebApplication"'), 'WebApplication JSON-LD stays static');
assert.ok(seo.includes('"@type": "FAQPage"'), 'FAQ JSON-LD stays static');
assert.ok(seo.includes('"@type": "BreadcrumbList"'), 'Breadcrumb JSON-LD stays static');
assert.ok(!hosted.includes('application/ld+json'), 'Hosted helper must not contain JSON-LD');
assert.ok(!loader.includes('application/ld+json'), 'Loader must not inject JSON-LD');

const jsonLdMatch = seoSource.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(jsonLdMatch, 'SEO source must contain JSON-LD');
assert.doesNotThrow(() => JSON.parse(jsonLdMatch[1]), 'Static JSON-LD must parse');

assert.ok(hosted.includes('data-mbs-espresso-assistant-hosted="v1"'), 'Hosted helper has a validation marker');
assert.ok(hosted.includes('mbsEspressoAssistant:v1:sessions'), 'Hosted helper keeps versioned session storage');
assert.ok(hosted.includes('mbsEspressoAssistant:v1:activeSessionId'), 'Hosted helper keeps versioned active-session storage');
assert.ok(!/\bfetch\s*\(/.test(hosted), 'Hosted helper must not call external APIs');
assert.ok(!/src\/(rules|app)\.js/.test(hosted), 'Hosted helper must be self-contained');

assert.ok(loader.includes('https://api.barista-school.ru/api/espresso-assistant.html'), 'Loader targets the hosted endpoint');
assert.ok(loader.includes('AbortController'), 'Loader aborts a slow request');
assert.ok(loader.includes('runScripts'), 'Loader reruns scripts from hosted HTML');
assert.ok(loader.includes('data-mbs-espresso-assistant-hosted="v1"'), 'Loader validates the hosted marker');
assert.ok(loader.includes('data-mbs-espresso-assistant-loader-slot'), 'Loader moves the helper into the static article');
assert.ok(loader.includes('быстрее 25 секунд'), 'Loader fallback uses the current advisory time range');
assert.ok(seo.includes('сладкий и сбалансированный'), 'Static method explains the balanced-taste exception');
assert.ok(hosted.includes('остаток кофе предыдущей настройки'), 'Hosted helper explains grinder retention after an adjustment');

for (const [name, content] of [['seo', seo], ['hosted', hosted], ['loader', loader], ['archive', archive]]) {
  assert.equal((content.match(/id=["']consalt["']/gi) || []).length, 0, `${name} must not shadow Tilda popup anchors`);
}
assert.ok(seo.includes('href="/barista_courses"'), 'Static CTA links to the basic course');
assert.ok(loader.includes('href=\"/barista_courses\"'), 'Loader fallback links to the basic course');
assert.ok(!/Tasty Coffee/i.test(preview), 'Public preview must use independent MBS copy');
assert.ok(!/Tasty Coffee/i.test(seo), 'Static public block must use independent MBS copy');
assert.ok(archive.includes('local full-page archive'), 'Full block is marked as a local archive');

const hostedScript = hosted.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
const loaderScript = loader.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
assert.ok(hostedScript, 'Hosted helper must contain a script');
assert.ok(loaderScript, 'Loader must contain a script');
assert.doesNotThrow(() => new Function(hostedScript), 'Hosted helper script must parse');
assert.doesNotThrow(() => new Function(loaderScript), 'Loader script must parse');

console.log('structure.test.mjs: passed');
