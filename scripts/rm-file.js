import fs from 'fs';
import path from 'path';

function checkPath(path) {
  try {
    const stats = fs.statSync(path);
    if (stats.isFile()) {
      return 'file';
    } else if (stats.isDirectory()) {
      return 'dir';
    }
  } catch (err) {
    console.error(err);
    return 'error';
  }
}

function rmfile(path) {
  try {
    fs.rmSync(path);
  } catch (err) {
    console.error(`Unable to delete file: '${path}'`);
    console.error(err);
  }
}

function rmdir(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        rmdir(curPath);
      } else {
        rmfile(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function rmfileordir(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    return;
  }
  const type = checkPath(resolvedPath);
  if (type === 'dir') {
    rmdir(filePath);
  } else if (type === 'file') {
    rmfile(resolvedPath);
  }
}

function start() {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    args.forEach((path) => {
      rmfileordir(path);
    });
  } else {
    const [scrPath = 'dist'] = args;
    rmfileordir(scrPath);
  }
}

start();
