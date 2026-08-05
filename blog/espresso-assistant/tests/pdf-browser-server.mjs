import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = process.env.MBS_PDF_TEST_OUTPUT || '/tmp/espresso-assistant-control.pdf';
const port = Number(process.env.MBS_PDF_TEST_PORT || 8765);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };

createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/__save_pdf__') {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    await writeFile(output, Buffer.concat(chunks));
    response.writeHead(204);
    response.end();
    console.log(`Saved browser PDF fixture to ${output}`);
    return;
  }
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const target = path.resolve(projectRoot, `.${pathname === '/' ? '/tests/pdf-browser-fixture.html' : pathname}`);
  if (!target.startsWith(projectRoot)) {
    response.writeHead(403);
    response.end();
    return;
  }
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404);
    response.end();
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`PDF browser fixture: http://127.0.0.1:${port}/tests/pdf-browser-fixture.html`);
});
