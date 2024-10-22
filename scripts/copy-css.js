import fs from 'fs';
import path from 'path';
import CleanCSS from 'clean-css';

function ensureFileExistence(filePath) {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
  }
}

function minisize(src, dest) {
  ensureFileExistence(dest);
  fs.readFile(src, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const cleanCSS = new CleanCSS({});
    const minifiedCSS = cleanCSS.minify(data).styles;
    fs.writeFile(dest, minifiedCSS, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

function start() {
  const args = process.argv.slice(2);
  const [srcPath = 'src/nprogress.css', destPath = 'dist/index.css'] = args;
  minisize(srcPath, destPath);
}

start();
