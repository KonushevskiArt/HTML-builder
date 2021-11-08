const fs = require('fs');
const path = require('path');

const pathInput = `${__dirname}/styles`;
const pathOutput = `${__dirname}/project-dist/bundle.css`;

const buildCss = (pathInput, pathOutput) => {
  const writeStream = fs.createWriteStream(pathOutput);

  fs.readdir(pathInput, {withFileTypes: true}, (err, data) => {
    if (err) throw err;
  
    for (const file of data) {
      const pathToFile = `${pathInput}/${file.name}`;
  
      if (file.isFile()) {
        fs.readFile(pathToFile, (err, data) => {
          if (err) throw err;
          if (path.extname(pathToFile)  === '.css') {
            writeStream.write(data.toString());
          }
        });
      }
    }
  
  }); 
}; 

buildCss(pathInput, pathOutput);


