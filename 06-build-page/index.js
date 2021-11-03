const fs = require('fs');
const path = require('path');

const pathInputCss = `${__dirname}/styles`;
const pathOutputCss = `${__dirname}/project-dist/style.css`;

const pathCopyAssets = `${__dirname}/project-dist/assets`;
const pathAssets = `${__dirname}/assets`;

const pathHTML = `${__dirname}/template.html`;
const pathDistHTML = `${__dirname}/project-dist/index.html`; 
const pathComponents = `${__dirname}/components`;

const buildCss = (pathInput, pathOutput) => {
  const writeStream = fs.createWriteStream(pathOutput);

  fs.readdir(pathInput, {withFileTypes: true}, (err, data) => {
    if (err) throw err;
  
    for (const file of data) {
      const pathToFile = `${pathInput}/${file.name}`;
  
      fs.readFile(pathToFile, (err, data) => {
        if (err) throw err;
        if (path.extname(pathToFile)  === '.css') {
          writeStream.write(data.toString());
        }
      });
    }
  }); 
}; 

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
      fs.rmdir(pathCopyDir, { recursive: true }, () => {
        copyDir(pathDir, pathCopyDir);
      });
    }
  });
};

const buildHTML = async (pathHTML, pathDistHTML, pathComponents) => {
  const writeStream = fs.createWriteStream(pathDistHTML);

  // read components
  fs.readdir(pathComponents, {withFileTypes: true}, (err, data) => {
    if (err) throw err;
    const arrPromises = [];
    const mapComponents = {}; 
  
    for (const file of data) {
      const pathToFile = `${pathComponents}/${file.name}`;

      arrPromises.push(new Promise((resolve) => {
        if (file.isFile() && path.extname(pathToFile)  === '.html') {
          fs.readFile(pathToFile, (err, data) => {
            if (err) throw err;
            mapComponents[file.name.replace(/\..+$/, '')] = data.toString();
            resolve();
          });
        }
      }));
    }

    Promise.all(arrPromises)
      .then(() => {
        fs.readFile(pathHTML, (err, data) => {
          let cash = data.toString();
          if (err) throw err;
          const res = cash.match(/\{\{.+\}\}/g);
          res.forEach(el => {
            const reg = new RegExp(el, 'g');
            cash = cash.replace(reg, mapComponents[el.replace(/[{}]/g, '')]);
          });
          writeStream.write(cash.toString());
        });
      });
  }); 
};

fs.mkdir(`${__dirname}/project-dist`, { recursive: true }, (err) => {
  if (err) throw err;

  buildCss(pathInputCss, pathOutputCss);
  refreshDir(pathAssets, pathCopyAssets);
  buildHTML(pathHTML, pathDistHTML, pathComponents);
});


