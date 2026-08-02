import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = (...segments) => path.join(projectRoot, 'src', ...segments);
const [styles, markup, previewTemplate] = await Promise.all([
  readFile(sourcePath('styles.css'), 'utf8'),
  readFile(sourcePath('markup.html'), 'utf8'),
  readFile(sourcePath('preview-template.html'), 'utf8'),
]);

const fontImport = "@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap');";
const tildaBlock = `<!-- MBS Barista Workplace: paste this complete file into one Tilda T123 HTML block. -->\n<style>\n${fontImport}\n${styles}\n</style>\n\n${markup.trimEnd()}\n`;
const preview = previewTemplate
  .replace('/* APP_STYLES */', styles)
  .replace('<!-- APP_MARKUP -->', markup);

await mkdir(projectRoot, { recursive: true });
await Promise.all([
  writeFile(path.join(projectRoot, 'index.html'), preview),
  writeFile(path.join(projectRoot, 'tilda-block.html'), tildaBlock),
]);

console.log('Built index.html and tilda-block.html');
