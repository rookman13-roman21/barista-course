const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const blocksDir = path.join(rootDir, 'tilda-blocks');
const hostedDir = path.join(rootDir, 'hosted');

const blockFiles = [
  '01-hero.html',
  '02-who-for.html',
  '03-results.html',
  '04-program.html',
  '05-format-price.html',
  '06-equipment.html',
  '07-faq.html',
  '08-final-cta.html',
  '09-online-booking-popup.html',
];

function readBlock(fileName) {
  return fs.readFileSync(path.join(blocksDir, fileName), 'utf8').trimEnd();
}

function buildPageBody() {
  return blockFiles.map(readBlock).join('\n\n') + '\n';
}

function writeFile(relativePath, content) {
  fs.writeFileSync(path.join(rootDir, relativePath), content, 'utf8');
  console.log(`wrote ${relativePath}`);
}

fs.mkdirSync(hostedDir, { recursive: true });

const pageBody = buildPageBody();

writeFile(
  'hosted/barista-courses-page.html',
  '<!-- MBS /barista_courses hosted page: deploy to https://api.barista-school.ru/api/barista-courses-page.html -->\n\n' + pageBody
);
