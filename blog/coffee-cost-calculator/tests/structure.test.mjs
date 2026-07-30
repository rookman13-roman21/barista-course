import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const block = await readFile(path.join(projectRoot, 'tilda-block.html'), 'utf8');
const preview = await readFile(path.join(projectRoot, 'index.html'), 'utf8');

assert.equal((block.match(/<h1\b/gi) || []).length, 1, 'Tilda block must contain one H1');
assert.equal((block.match(/id=["']consalt["']/gi) || []).length, 0, 'Tilda block must not shadow the Tilda popup anchor');
assert.ok(block.includes('mbsCostCalc:v1:prices'), 'namespaced price storage key is present');
assert.ok(block.includes('mbsCostCalc:v1:selection'), 'namespaced selection storage key is present');
assert.ok(block.includes('href="#consalt"'), 'Mixology CTA preserves the Tilda popup anchor');
assert.ok(block.includes('href="/open_cafe_app"'), 'Coffee Menu CTA is present');
assert.ok(!/\bfetch\s*\(/.test(block), 'Tilda block must not call external APIs');
assert.ok(!/src\/(data|calc|app)\.js/.test(block), 'Tilda block must be self-contained');
assert.ok(preview.includes('<title>Калькулятор себестоимости кофейных напитков'), 'preview has a page title');

const inlineScript = block.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
assert.ok(inlineScript, 'Tilda block must contain an inline script');
assert.doesNotThrow(() => new Function(inlineScript), 'Tilda inline script must parse');

console.log('structure.test.mjs: passed');
