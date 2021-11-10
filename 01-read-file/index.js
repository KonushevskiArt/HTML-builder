const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileName);

readStream.on('data', (data) => {
  console.log((data.toString()).trim());
});