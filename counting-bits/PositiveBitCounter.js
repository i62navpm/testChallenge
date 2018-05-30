function Count(input = 0) {
  function checkErrors() {
    if (!Number.isInteger(input)) throw new Error(`A ${typeof input} value is supplied`)
    if (input < 0) throw new RangeError('A negative value is supplied')
  }

  function decimaltoBinary() {
    return input.toString(2)
  }

  function countOnes(binaryNumber = '') {
    const { length } = binaryNumber.match(/1/g) || []
    return length
  }

  function getOnesPositions(binaryNumber = '') {
    return binaryNumber
      .split('')
      .reverse()
      .reduce((after, before, index) => (+before ? [...after, index] : after), [])
  }

  checkErrors()

  const binaryNumber = decimaltoBinary()
  const numberOnes = countOnes(binaryNumber)
  const positionOnes = getOnesPositions(binaryNumber)

  return [numberOnes, ...positionOnes]
}

module.exports = { Count }
