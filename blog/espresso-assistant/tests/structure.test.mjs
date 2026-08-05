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
assert.ok(!/\bXMLHttpRequest\b/.test(hosted), 'Hosted helper must not use external request clients');
assert.ok(!/src\/(rules|app)\.js/.test(hosted), 'Hosted helper must be self-contained');
assert.ok(hosted.includes('data:image/png;base64,'), 'Hosted helper embeds the print logo');
assert.ok(!hosted.includes('static.tildacdn.com/tild3934-3663-4132-a239-316638666135/MBS_LOGO.png'), 'Hosted helper does not load the print logo from CDN');
assert.ok(!/<(?:img|script|link)[^>]+(?:src|href)=["']https?:/i.test(hosted), 'Hosted helper has no external runtime resources');
assert.ok(hosted.includes('data-export-all'), 'Hosted helper exposes the full-journal PDF action');
assert.ok(hosted.includes('data-export-session'), 'Hosted helper exposes the current-session PDF action');
assert.ok(hosted.includes('data-mbs-espresso-assistant-print-root'), 'Report prints through a dedicated root in the current document for mobile Safari');
assert.ok(hosted.includes('body>*{display:none!important}'), 'Only the report is visible during system printing');
assert.ok(!hosted.includes('URL.createObjectURL(new Blob([report.html]'), 'Report avoids mobile Safari blob preview tabs');
assert.ok(hosted.includes('data-create-roast-date'), 'Hosted helper records the roast date');
assert.ok(hosted.includes('Рекомендация не зафиксирована'), 'Hosted helper handles attempts without a historical recommendation');

assert.ok(loader.includes('https://api.barista-school.ru/api/espresso-assistant.html'), 'Loader targets the hosted endpoint');
assert.ok(loader.includes('AbortController'), 'Loader aborts a slow request');
assert.ok(loader.includes('runScripts'), 'Loader reruns scripts from hosted HTML');
assert.ok(loader.includes('data-mbs-espresso-assistant-hosted="v1"'), 'Loader validates the hosted marker');
assert.ok(loader.includes('data-mbs-espresso-assistant-loader-slot'), 'Loader moves the helper into the static article');
assert.ok(loader.includes('быстрее 25 секунд'), 'Loader fallback uses the current advisory time range');
assert.ok(seo.includes('сладкий и сбалансированный'), 'Static method explains the balanced-taste exception');
assert.ok(hosted.includes('остаток кофе предыдущей настройки'), 'Hosted helper explains grinder retention after an adjustment');
assert.ok(seo.includes('data-mbs-espresso-assistant-faq'), 'Static FAQ has its own single-open accordion scope');
assert.ok(seo.includes("item.addEventListener('toggle'"), 'Static FAQ closes other items when one is opened');
assert.ok(seo.includes('other.open = false'), 'Static FAQ enforces one open item');
assert.equal((hosted.match(/<input[^>]+type="date"/g) || []).length, 2, 'Roast dates preserve the native date picker');
assert.equal((hosted.match(/mbs-espresso-assistant__date-picker/g) || []).length >= 2, true, 'Native date fields are placed in fixed-width picker shells');
assert.ok(hosted.includes('overflow: hidden'), 'Date-picker shells prevent iOS intrinsic width from escaping the card');
assert.ok(hosted.includes('data-create-roast-date-display'), 'The selected creation date is visible above the native picker');
assert.ok(hosted.includes('mbs-espresso-assistant__back {'), 'The all-sessions control has a dedicated button style');
assert.ok(hosted.includes('mbs-espresso-assistant__saved-roast-date'), 'Saved-session roast date has its own unbroken line');
assert.ok(hosted.includes('mbs-espresso-assistant__recommendation h3 { margin-bottom: 14px; font-size: 23px'), 'Mobile recommendation hierarchy stays compact');

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
