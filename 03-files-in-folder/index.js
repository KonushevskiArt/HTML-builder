const path = require('path');
const fs = require('fs');

try {
  const fileName = path.join(__dirname, 'secret-folder');
  const pathDir = fileName;

  fs.readdir(pathDir, {withFileTypes: true}, (err, data) => {
    for (const file of data) {
      if (file.isFile()) {
        fs.stat(`${pathDir}/${file.name}`, function(err, stats) {
          const extention = path.extname(file.name);
          const name = path.basename(file.name, path.extname(file.name));
          console.log(`${name} - ${extention} - ${stats.size / 1000}kb`);
        });
      }
    }
  });
} catch (err) {
  console.error(err);
}