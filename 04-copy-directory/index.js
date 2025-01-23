const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');

async function copyDir() {
  try {
    const pathSrcDir = path.join(__dirname, 'files');
    const pathCopyDir = path.join(__dirname, 'files-copy');

    await fsPromise.mkdir(pathCopyDir, { recursive: true });
    const copyFiles = await fsPromise.readdir(pathCopyDir, {
      withFileTypes: true,
    });

    const files = await fsPromise.readdir(pathSrcDir, {
      withFileTypes: true,
    });

    for (const file of files) {
      if (file.isFile()) {
        const copyFileSrc = path.join(pathSrcDir, file.name);
        const copyFileDest = path.join(pathCopyDir, file.name);

        for (const copyFile of copyFiles) {
          if (!files.some((file) => file.name === copyFile.name)) {
            await fsPromise.unlink(
              path.join(__dirname, 'files-copy', copyFile.name),
            );
          }
        }

        fs.copyFile(
          copyFileSrc,
          copyFileDest,
          fs.constants.COPYFILE_FICLONE,
          (err) => {
            if (err) console.error(err.message);
          },
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir();
