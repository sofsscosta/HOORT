const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = async function () {

    const token = await this.storage.getItem('token')

    const retrieve = await fetch(`${this.API_URL}/items`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const item = await retrieve.json()

    const { error } = await item

    if (error) throw new Error(error)

    if (!item) throw new Error('You have no planted or harvested veggies yet!')

    return item
}.bind(context)