const path = require('path');
const fs = require('fs');
const readline = require('readline');
const process = require('process');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const fileName = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(fileName);

console.log('Please write text here');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    writeStream.write(input.replace('exit', ''));
    rl.close();
  } else {
    writeStream.write(input);
  }
});

rl.on('close', () => {
  console.log('\nclose interface!');
});