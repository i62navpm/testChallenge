const fs = require('fs')

class CheckClass {
  constructor(file) {
    this.file = null
  }

  Check(file) {
    this.file = file
    return this.activate()
  }

  async activate() {
    try {
      let orders = await this.streamFile(this.file)
      return this.checkFraud(orders)
    } catch (err) {
      return new Error(err)
    }
  }

  streamFile(file = '') {
    const stream = fs.createReadStream(file, { encoding: 'utf8' })

    return new Promise((resolve, reject) => {
      stream.on('data', orders => {
        resolve(this.parseOrders(orders.split('\n')))
        stream.destroy()
      })
      stream.on('error', err => reject(err))
    })
  }

  parseOrders(orders) {
    return orders.map(order => {
      let [orderId, dealId, email, street, city, state, zipCode, creditCard] = order.split(',')

      orderId = +orderId
      dealId = +dealId
      email = email.toLowerCase()
      street = street.toLowerCase()
      city = city.toLowerCase()
      state = state.toLowerCase()

      return {
        orderId,
        dealId,
        email: this.normalizeEmail(email),
        street: this.normalizeStreet(street),
        city,
        state: this.normalizeState(state),
        zipCode,
        creditCard,
      }
    })
  }

  normalizeEmail(email) {
    return email.replace(
      /(.*)(?:\+.*)(@.*)/gm,
      (email, name, domain) => name.replace(/\./g, '') + domain
    )
  }

  normalizeStreet(street) {
    const abbreviation = { 'st.': 'street', 'rd.': 'road' }

    Object.keys(abbreviation).forEach(key => {
      street = street.replace(key, abbreviation[key])
    })
    return street
  }

  normalizeState(state) {
    const abbreviation = {
      il: 'illinois',
      ca: 'california',
      cl: 'colorado',
      ny: 'new york',
    }

    Object.keys(abbreviation).forEach(key => {
      state = state.replace(key, abbreviation[key])
    })
    return state
  }

  isSameEmail(orderA, orderB) {
    return orderA.email === orderB.email
  }

  isSameAddress(orderA, orderB) {
    return (
      orderA.state === orderB.state &&
      orderA.zipCode === orderB.zipCode &&
      orderA.street === orderB.street &&
      orderA.city === orderB.city
    )
  }

  isSameCreditCard(orderA, orderB) {
    return orderA.creditCard === orderB.creditCard
  }

  checkFraud(orders) {
    const orderDict = orders.reduce(
      (after, before) => ({ ...after, ...{ [before.dealId]: before } }),
      {}
    )

    return orders.reduce((after, order) => {
      const orderB = orderDict[order.dealId]
      const checkFraudEmail =
        this.isSameEmail(order, orderB) && !this.isSameCreditCard(order, orderB)
      const checkFraudAddress =
        this.isSameAddress(order, orderB) && !this.isSameCreditCard(order, orderB)

      return checkFraudEmail || checkFraudAddress
        ? [...after, { isFraudulent: true, orderId: orderB.orderId }]
        : after
    }, [])
  }
}

let checkObj = new CheckClass()

module.exports = { Check: checkObj.Check.bind(checkObj) }
