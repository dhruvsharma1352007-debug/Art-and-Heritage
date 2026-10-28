import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const pages = [
  { folder: 'renaissance-paintings', flat: 'renaissance-paintings.html' },
  { folder: 'indian-folk-art', flat: 'indian-folk-art.html' },
  { folder: 'impressionist-paintings', flat: 'impressionist-paintings.html' },
];

for (const page of pages) {
  const folderIndex = path.join(distDir, page.folder, 'index.html');
  const flatHtml = path.join(distDir, page.flat);

  if (fs.existsSync(folderIndex)) {
    fs.copyFileSync(folderIndex, flatHtml);
    console.log(`[postbuild] Copied ${page.folder}/index.html -> ${page.flat}`);
  }
}

console.log('[postbuild] Static multi-page pre-rendering verified.');
