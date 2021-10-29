const path = require('path');
const fs = require('fs');

try {
  const pathDir = `${__dirname}/secret-folder`;

  fs.readdir(pathDir, {withFileTypes: true}, (err, data) => {
    for (const file of data) {
      if (file.isFile()) {
        fs.stat(`${pathDir}/${file.name}`, function(err, stats) {
          const name = file.name.replace(/\..+$/, '');
          const ext = path.extname(`${pathDir}/${file.name}`).replace(/^\./, '');
          console.log(`name: ${name}, ext: ${ext}, size: ${stats.size}kb`);
        });
      }
    }
  });
} catch (err) {
  console.error(err);
}
