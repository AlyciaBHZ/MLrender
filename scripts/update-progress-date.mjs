import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readmePath = resolve(__dirname, '..', 'README.md');
const content = readFileSync(readmePath, 'utf8');

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const newDate = `${yyyy}-${mm}-${dd}`;

// Look for progress header and update the next "- Date:" line under it
const possibleHeaders = [
  '## Current Tasks (P3.2 / P3.3 / P5.1)',
  '## Milestones (P3.2 / P3.3 / P5.1)',
  '## ??? (P3.2 / P3.3 / P5.1)'
];

let headerIndex = -1;
let headerText = '';
for (const h of possibleHeaders) {
  const i = content.indexOf(h);
  if (i !== -1) { headerIndex = i; headerText = h; break; }
}

if (headerIndex === -1) {
  console.error('Progress section header not found.');
  process.exit(1);
}

const before = content.slice(0, headerIndex);
const after = content.slice(headerIndex);
const lines = after.split(/\r?\n/);

const datePrefix = '- Date:';
let dateLineIdx = -1;
for (let i = 1; i < Math.min(lines.length, 50); i++) {
  const l = lines[i].trim();
  if (l.startsWith(datePrefix)) { dateLineIdx = i; break; }
  if (lines[i].startsWith('## ') && i > 1) break; // next section reached
}

if (dateLineIdx === -1) {
  // Insert date line just after header if missing
  lines.splice(1, 0, `${datePrefix} ${newDate}`);
} else {
  lines[dateLineIdx] = `${datePrefix} ${newDate}`;
}

const updated = before + lines.join('\n');
writeFileSync(readmePath, updated, 'utf8');
console.log(`Progress date updated -> ${newDate}`);
