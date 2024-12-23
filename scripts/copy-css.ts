import fs from 'fs';
import path from 'path';
import CleanCSS from 'clean-css';

function copy(
  src: string,
  dest: string,
  modify: boolean,
  callback: (data?: string | Buffer<ArrayBufferLike>, stream?: fs.WriteStream) => void
) {
  const destPath = path.dirname(dest);
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  const srcStream = fs.createReadStream(src, { encoding: 'utf-8' });
  const destStream = fs.createWriteStream(dest, { encoding: 'utf-8' });
  if (modify) {
    srcStream.on('data', (data) => {
      callback(data, destStream);
    });
  } else {
    srcStream.pipe(destStream);
    callback(undefined, undefined);
  }
}

function start() {
  fs.closeSync(fs.openSync('nprogress.css', 'w'));
  const args = process.argv.slice(2);
  const [srcPath = 'src/nprogress.css', destPath = 'dist/nprogress.css', modify = ''] = args;
  copy(srcPath, destPath, modify === '--modify' ? true : false, (data, destStream) => {
    if (modify === '--modify' && data) {
      const cleanCSS = new CleanCSS({});
      const minifiedCSS = cleanCSS.minify(data).styles;
      destStream?.write(minifiedCSS);
    }
  });
}

start();
