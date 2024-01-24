const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');

async function copyDir() {
  try {
    const pathSrcDir = path.join(__dirname, 'files');
    const pathCopyDir = path.join(__dirname, 'files-copy');

    const dirCreation = await fsPromise.mkdir(pathCopyDir, { recursive: true });

    const files = await fsPromise.readdir(pathSrcDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const copyFileSrc = path.join(pathSrcDir, file.name);
        const copyFileDest = path.join(pathCopyDir, file.name);

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
