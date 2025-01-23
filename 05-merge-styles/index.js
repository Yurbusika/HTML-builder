const path = require('path');
const fsPromise = require('fs/promises');

async function mergeStyles() {
  try {
    const styles = await fsPromise.readdir(path.join(__dirname, 'styles'));
    let bundle = '';
    for (const styleFile of styles) {
      const indexOfPoint = styleFile.indexOf('.');
      const fileExtension = styleFile.slice(indexOfPoint + 1);
      if (fileExtension === 'css') {
        const data = await fsPromise.readFile(
          path.join(__dirname, 'styles', styleFile),
        );
        bundle += data + '\n';
      }
      fsPromise.writeFile(
        path.join(__dirname, 'project-dist', 'bundle.css'),
        bundle,
      );
    }
  } catch (err) {
    console.error(err);
  }
}
mergeStyles();
