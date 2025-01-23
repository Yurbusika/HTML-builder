const path = require('path');
const fsPromise = require('fs/promises');

async function buildPage() {
  try {
    await fsPromise.mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });

    const template = await fsPromise.readFile(
      path.join(__dirname, 'template.html'),
    );
    let templateStr = template.toString();
    let startIndex = 0;
    let indexStr = '';

    while (templateStr.includes('{')) {
      const firstIndex = templateStr.indexOf('{');
      const lastIndex = templateStr.indexOf('}');
      const tagName = templateStr.substring(firstIndex + 2, lastIndex);
      const component = await fsPromise.readFile(
        path.join(__dirname, 'components', `${tagName}.html`),
      );
      indexStr += templateStr.slice(startIndex, firstIndex) + component;
      templateStr = templateStr.slice(lastIndex + 2);
    }
    fsPromise.writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      indexStr,
    );

    const assetsFiles = await fsPromise.readdir(
      path.join(__dirname, 'assets'),
      { recursive: true, withFileTypes: true },
    );
    await fsPromise.rm(path.join(__dirname, 'project-dist', 'assets'), {
      recursive: true,
      force: true,
    });

    for (const dir of assetsFiles) {
      if (dir.isDirectory()) {
        const pathDirSrc = path.join(__dirname, 'assets', dir.name);
        const pathDirCopy = path.join(
          __dirname,
          'project-dist',
          'assets',
          dir.name,
        );

        await fsPromise.mkdir(pathDirCopy, {
          recursive: true,
        });
        const dirFiles = await fsPromise.readdir(pathDirSrc, {
          withFileTypes: true,
        });
        for (const file of dirFiles) {
          if (file.isFile()) {
            const copyFileSrc = path.join(pathDirSrc, file.name);
            const copyFileDest = path.join(pathDirCopy, file.name);
            fsPromise.copyFile(copyFileSrc, copyFileDest);
          }
        }
      }
    }

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
        path.join(__dirname, 'project-dist', 'style.css'),
        bundle,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

buildPage();
