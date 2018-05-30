const program = require('commander')
const PositiveBitCounter = require('./PositiveBitCounter')

program.version('1.0.0', '-v, --version')
program.option('--count <n>', 'Count number of bits', parseInt).parse(process.argv)

console.log(PositiveBitCounter.Count(program.count))
