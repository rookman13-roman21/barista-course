const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const blocksDir = path.join(rootDir, 'tilda-blocks');
const hostedDir = path.join(rootDir, 'hosted');

const blockFiles = [
  '00-seo-and-page-styles.html',
  '01-top-content.html',
  '02-schedule-widget-styles.html',
  '03-schedule-widget-script.html',
  '04-bottom-content.html',
  '05-page-scripts.html',
];

function readBlock(fileName) {
  return fs.readFileSync(path.join(blocksDir, fileName), 'utf8').trimEnd();
}

function buildPageBody() {
  return blockFiles.map(readBlock).join('\n\n') + '\n';
}

function buildPreviewHtml(pageBody) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каппинг кофе — локальное превью</title>
  <meta name="description" content="Локальное превью страницы каппинга Московской школы бариста.">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body { background: #FFFFFF; color: #1F1F1F; font-family: Mulish, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .preview-bar { position: sticky; top: 0; z-index: 1000000; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 42px; padding: 10px 16px; background: #1F1F1F; color: #FFFFFF; font-size: 13px; font-weight: 700; line-height: 1.3; text-align: center; }
    .preview-bar a { color: #B6D8AB; font-weight: 900; text-decoration: none; }
    @media (max-width: 820px) { .preview-bar { position: static; display: block; } .preview-bar a { display: block; margin-top: 4px; } }
  </style>
</head>
<body>
  <div class="preview-bar">
    Локальное превью страницы «Каппинг кофе» собрано из Tilda-блоков 00–05
    <a href="https://baristaschool.ru/capping" target="_blank" rel="noopener noreferrer">Текущая страница</a>
  </div>

${pageBody}
</body>
</html>
`;
}

function writeFile(relativePath, content) {
  fs.writeFileSync(path.join(rootDir, relativePath), content, 'utf8');
  console.log(`wrote ${relativePath}`);
}

fs.mkdirSync(hostedDir, { recursive: true });

const pageBody = buildPageBody();

writeFile('tilda-block.html', pageBody);
writeFile('index.html', buildPreviewHtml(pageBody));
writeFile('hosted/capping-page.html', `<!-- MBS /capping hosted page: deploy to https://api.barista-school.ru/api/capping-page.html -->\n\n${pageBody}`);
