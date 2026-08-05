import assert from 'node:assert/strict';
import { assembleImagePdf } from '../src/pdf.js';

const fakeJpeg = new Uint8Array([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
  0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
  0x00, 0x48, 0x00, 0x00, 0xff, 0xd9,
]);

const bytes = assembleImagePdf([
  { bytes: fakeJpeg, width: 1684, height: 1190 },
  { bytes: fakeJpeg, width: 1684, height: 1190 },
]);
const latin = new TextDecoder('latin1').decode(bytes);

assert.equal(String.fromCharCode(...bytes.slice(0, 8)), '%PDF-1.4');
assert.match(latin, /\/Type \/Catalog/);
assert.match(latin, /\/Type \/Pages/);
assert.match(latin, /\/Count 2/);
assert.match(latin, /\/MediaBox \[0 0 842 595\]/);
assert.equal((latin.match(/\/Subtype \/Image/g) || []).length, 2);
assert.equal((latin.match(/\/Filter \/DCTDecode/g) || []).length, 2);
assert.match(latin, /xref\n0 9/);
assert.match(latin, /startxref\n\d+\n%%EOF/);

assert.throws(() => assembleImagePdf([]), /At least one PDF page/);

console.log('pdf.test.mjs: passed');
