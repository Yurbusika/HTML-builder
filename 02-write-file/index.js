const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Please enter your message:\n');
stdin.on('data', (chunk) => {
  output.write(chunk);
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  process.exit(1);
});
