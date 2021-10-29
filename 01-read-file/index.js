const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/text.txt`);

readStream.on('data', (data) => {
  console.log((data.toString()).trim());
});
