const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = async function (landId) {
    validate.string(landId, 'landId')

    const token = await this.storage.getItem('token')

    const retrieve = await fetch(`${this.API_URL}/land/${landId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })

    const land = await retrieve.json()

    const { error } = await land

    if (error) throw new Error(error)

    if (!land) throw new Error('You have no lands yet!')

    return land
}.bind(context)