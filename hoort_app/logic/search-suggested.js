const context = require('./context')
const fetch = require('node-fetch')

module.exports = async function () {

    const search = await fetch(`${this.API_URL}/items/reccommended`, {
        method: 'GET',
        headers: { 'Content-Type': `application/json` }
    })

    const results = await search.json()

    const { error } = results

    if (error) {
        return new Error(error)
    }

    else return results
}.bind(context)