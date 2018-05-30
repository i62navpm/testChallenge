const program = require('commander')
const path = require('path')
const FraudRadar = require('./FraudRadar')

program.version('1.0.0', '-v, --version')
program.option('--file <n>', 'File directory').parse(process.argv)
;(async () => {
  console.log(await FraudRadar.Check(path.join(__dirname, program.file)))
})()
