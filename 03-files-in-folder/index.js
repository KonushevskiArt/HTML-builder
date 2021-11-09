const path = require('path');
const fs = require('fs');

try {
  const pathDir = `${__dirname}/secret-folder`;

  fs.readdir(pathDir, {withFileTypes: true}, (err, data) => {
    for (const file of data) {
      if (file.isFile()) {
        fs.stat(`${pathDir}/${file.name}`, function(err, stats) {
          const extention = path.extname(`${pathDir}/${file.name}`);
          const regEx = new RegExp(extention);
          const name = file.name.replace(regEx, '');
          const ext = path.extname(`${pathDir}/${file.name}`).replace(/^\./, '');
          console.log(`${name} - ${ext} - ${stats.size / 1000}kb`);
        });
      }
    }
  });
} catch (err) {
  console.error(err);
}