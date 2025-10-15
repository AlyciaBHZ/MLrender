import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readmePath = resolve(__dirname, '..', 'README.md');
const content = readFileSync(readmePath, 'utf8');

// Locate the 自监督进度跟踪 section and replace the date on the line starting with "- 更新时间:"
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const newDate = `${yyyy}-${mm}-${dd}`;

const header = '## 自监督进度跟踪';
const idx = content.indexOf(header);
if (idx === -1) {
  console.error('No 自监督进度跟踪 section found.');
  process.exit(1);
}

const before = content.slice(0, idx);
const after = content.slice(idx);
const lines = after.split(/\r?\n/);
const dateLineIdx = lines.findIndex((l) => l.trim().startsWith('- 更新时间:'));
if (dateLineIdx === -1) {
  console.error('No 更新时间 line found after 自监督进度跟踪.');
  process.exit(1);
}
lines[dateLineIdx] = `- 更新时间: ${newDate}`;
const updated = before + lines.join('\n');

writeFileSync(readmePath, updated, 'utf8');
console.log(`README 自监督进度跟踪 更新时间 -> ${newDate}`);
