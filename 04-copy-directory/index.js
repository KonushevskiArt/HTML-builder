const fs = require('fs');

const pathCopyDir = `${__dirname}/files-copy`;
const pathDir = `${__dirname}/files`;

const refreshDir = (pathCopyDir, pathDir) => {
  
  const copyDir = (pathDir, pathCopyDir) => {
    fs.mkdir(pathCopyDir, { recursive: true }, (err) => {
      if (err) throw err;
  
      fs.readdir(pathDir, {withFileTypes: true}, (err, data) => {
        if (err) throw err;
  
        for (const file of data) {
          fs.copyFile(`${pathDir}/${file.name}`, `${pathCopyDir}/${file.name}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  };
  
  fs.stat(pathCopyDir, (err) => {
    if (err && err.code === 'ENOENT') {
      copyDir(pathDir, pathCopyDir);
    }
    else {
      fs.rmdir(pathCopyDir, { recursive: true }, () => {
        copyDir(pathDir, pathCopyDir);
      });
    }
  });
};

refreshDir(pathCopyDir, pathDir);