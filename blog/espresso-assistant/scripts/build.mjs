import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = (...segments) => path.join(projectRoot, 'src', ...segments);
const assetPath = (...segments) => path.join(projectRoot, 'assets', ...segments);

function makeClassicScript(source) {
  return source
    .replace(/^export\s+/gm, '')
    .replace(/^import[^;]+;\s*$/gm, '');
}

const [styles, seoMarkup, hostedMarkup, previewTemplate, rules, report, app, logo] = await Promise.all([
  readFile(sourcePath('styles.css'), 'utf8'),
  readFile(sourcePath('seo-markup.html'), 'utf8'),
  readFile(sourcePath('hosted-markup.html'), 'utf8'),
  readFile(sourcePath('preview-template.html'), 'utf8'),
  readFile(sourcePath('rules.js'), 'utf8'),
  readFile(sourcePath('report.js'), 'utf8'),
  readFile(sourcePath('app.js'), 'utf8'),
  readFile(assetPath('mbs-logo-print.png')),
]);

const logoDataUri = `data:image/png;base64,${logo.toString('base64')}`;
const runtimeBody = [rules, report, app].map(makeClassicScript).join('\n\n');
const runtime = `(function () {\nconst MBS_ESPRESSO_LOGO_DATA_URI = ${JSON.stringify(logoDataUri)};\n${runtimeBody}\n}());`;
const loaderSlot = '<div data-mbs-espresso-assistant-loader-slot aria-live="polite"></div>';
if (!seoMarkup.includes(loaderSlot)) throw new Error('SEO markup does not contain the hosted loader slot');

const fullMarkup = seoMarkup.replace(loaderSlot, hostedMarkup);
const tildaSeoBlock = `<!-- MBS Espresso Assistant: static SEO block for Tilda. Paste before tilda-loader.html. -->\n<style>\n${styles}\n</style>\n\n${seoMarkup}`;
const hostedPage = `<!-- MBS Espresso Assistant: deploy to https://api.barista-school.ru/api/espresso-assistant.html -->\n<style>\n${styles}\n</style>\n\n${hostedMarkup}\n\n<script>\n${runtime}\n</script>\n`;
const archive = `<!-- MBS Espresso Assistant: local full-page archive. Do not paste into Tilda; use tilda-seo-block.html and tilda-loader.html. -->\n<style>\n${styles}\n</style>\n\n${fullMarkup}\n\n<script>\n${runtime}\n</script>\n`;
const preview = previewTemplate
  .replace('/* APP_STYLES */', `body{margin:0;background:#fff;}\n${styles}`)
  .replace('<!-- SEO_MARKUP -->', fullMarkup)
  .replace('<!-- HOSTED_MARKUP -->', '')
  .replace('/* APP_SCRIPT */', runtime);

await mkdir(path.join(projectRoot, 'hosted'), { recursive: true });
await Promise.all([
  writeFile(path.join(projectRoot, 'index.html'), preview),
  writeFile(path.join(projectRoot, 'tilda-seo-block.html'), tildaSeoBlock),
  writeFile(path.join(projectRoot, 'tilda-block.html'), archive),
  writeFile(path.join(projectRoot, 'hosted', 'espresso-assistant.html'), hostedPage),
]);

console.log('Built index.html, tilda-seo-block.html, tilda-block.html and hosted/espresso-assistant.html');
