const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Please enter your message:\n');
stdin.on('data', (chunk) => {
  const strChunk = chunk.toString().trim();

  if (strChunk === 'exit') {
    stdout.write('Goodbye!\n');
    process.exit(1);
  }
  output.write(chunk);
});

process.on('SIGINT', () => {
  stdout.write('\nGoodbye!\n');
  process.exit(1);
});
