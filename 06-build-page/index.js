const fs = require('fs');
const path = require('path');

const pathInputCss = `${__dirname}/styles`;
const pathOutputCss = `${__dirname}/project-dist/bundle.css`;

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
        };
      });
    }
  }); 
} 

const copyDir = (pathDir, pathCopyDir) => {
  fs.mkdir(pathCopyDir, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(pathDir, {withFileTypes: true}, (err, data) => {
      if (err) throw err;

      for (const file of data) {
        if (file.isDirectory()) {   
          copyDir(`${pathDir}/${file.name}`, `${pathCopyDir}/${file.name}`);
        } else {
          fs.copyFile(`${pathDir}/${file.name}`, `${pathCopyDir}/${file.name}`, (err) => {
            if (err) throw err;
          });
        }
      }
    });
  });
}

const buildHTML = async (pathHTML, pathDistHTML, pathComponents) => {

  // read components
  fs.readdir(pathComponents, {withFileTypes: true}, (err, data) => {
    if (err) throw err;
    const arrPromises = [];
    const mapComponents = {}; 
  
    for (const file of data) {
      const pathToFile = `${pathComponents}/${file.name}`;

      arrPromises.push(new Promise((resolve, reject) => {
        if (file.isFile() && path.extname(pathToFile)  === '.html') {
          fs.readFile(pathToFile, (err, data) => {
            if (err) throw err;
            mapComponents[file.name.replace(/\..+$/, '')] = data.toString();
            resolve();
          });
        }
      }))
    }

    Promise.all(arrPromises)
    .then(() => {
      fs.readFile(pathHTML, (err, data) => {
        let cash = data.toString();
        if (err) throw err;
        const res = cash.match(/\{\{.+\}\}/g);
        res.forEach(el => {
          reg = new RegExp(el, "g");
          cash = cash.replace(reg, mapComponents[el.replace(/[\{\}]/g, '')])
        })
        console.log(cash)
        //// next step
      });
    })
  }); 
} 


buildCss(pathInputCss, pathOutputCss);
copyDir(pathAssets, pathCopyAssets);
buildHTML(pathHTML, pathDistHTML, pathComponents);
