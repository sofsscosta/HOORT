const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = async function (query) {
    validate.string(query, 'query')

    const search = await fetch(`${this.API_URL}/allitems/${query}`, {
        method: 'GET',
        headers: { 'Content-Type': `application/json` }
    })

    const results = await search.json()

    const { error } = results

    if (error) {
        throw new Error(error)
    }

    else return results
}.bind(context)