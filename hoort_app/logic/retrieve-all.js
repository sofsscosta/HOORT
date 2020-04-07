const context = require('./context')
const fetch = require('node-fetch')

module.exports = async function () {

    const retrieve = await fetch(`${this.API_URL}/items/all`, {
        method: 'GET',
        headers: { 'Content-Type': `application/json` }
    })

    const items = await retrieve.json()

    const { error } = await items

    if (error) throw new Error(error)

    if (!items.length) throw new Error('No veggies to display')

    return items
}.bind(context)