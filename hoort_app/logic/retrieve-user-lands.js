const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = async function () {

    const token = await this.storage.getItem('token')

    const retrieve = await fetch(`${this.API_URL}/land/user`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })

    const lands = await retrieve.json()

    const { error } = await lands

    if (error) throw new Error(error)

    return lands
}.bind(context)