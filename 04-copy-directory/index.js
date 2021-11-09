const fs = require('fs');

const pathCopyDir = `${__dirname}/files-copy`;
const pathDir = `${__dirname}/files`;

const refreshDir = (pathDir, pathCopyDir) => {
  
  const copyDir = (pathDir, pathCopyDir) => {
    fs.mkdir(pathCopyDir, { recursive: true }, (err) => {
      if (err) throw err;
  
      fs.readdir(pathDir, {withFileTypes: true}, (err, data) => {
        if (err) throw err;
        for (const elem of data) {
          if (elem.isFile()) {
            fs.copyFile(`${pathDir}/${elem.name}`, `${pathCopyDir}/${elem.name}`,  (err) => {
              if (err) throw err;
            });
          } else {
            refreshDir(`${pathDir}/${elem.name}`, `${pathCopyDir}/${elem.name}`);
          }
        }
      });
    });
  };
  
  fs.stat(pathCopyDir, (err) => {
    if (err && err.code === 'ENOENT') {
      copyDir(pathDir, pathCopyDir);
    }
    else {
      fs.rm(pathCopyDir, { recursive: true }, () => {
        copyDir(pathDir, pathCopyDir);
      });
    }
  });
};

refreshDir(pathDir, pathCopyDir);