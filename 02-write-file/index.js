
const fs = require('fs');
const readline = require('readline');
const process = require('process');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const writeStream = fs.createWriteStream(`${__dirname}/some-text.txt`);

console.log('Please write text here');

rl.on('line', (input) => {
  const isExit = input.match(/exit/g);
  if (isExit) {
    writeStream.write(input.replace('exit', ''));
    rl.close();
  } else {
    writeStream.write(input);
  }
});

rl.on('close', () => {
  console.log('\nclose interface!');
});