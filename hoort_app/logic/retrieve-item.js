const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = async function (id) {
    validate.string(id, 'id')

    const retrieve = await fetch(`${this.API_URL}/item/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': `application/json` }
    })

    const item = await retrieve.json()

    const { error } = await item

    if (error) throw new Error('There\'s no item corresponding to this id!')

    return item
}.bind(context)