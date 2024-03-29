const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');
const secretPath = path.join(__dirname, 'secret-folder');

async function parseFiles() {
  try {
    const files = await fsPromise.readdir(secretPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const indexOfPoint = file.name.indexOf('.');
        const fileName = file.name.slice(0, indexOfPoint);
        const fileExtension = file.name.slice(indexOfPoint + 1);
        const fileSizeByte = (await getFileStat(file)).size;
        const fileSize = fileSizeByte / 1000;
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
parseFiles();

function getFileStat(file) {
  return new Promise((resolve, reject) => {
    fs.stat(path.join(file.path, file.name), (err, stats) => {
      if (err) {
        console.error(err.message);
        return reject(err);
      }
      return resolve(stats);
    });
  });
}
