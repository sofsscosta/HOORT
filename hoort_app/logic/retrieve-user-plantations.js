const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = function () {

    return (async () => {

        const token = await this.storage.getItem('token')

        const retrieve = await fetch(`${this.API_URL}/land/plantations`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const lands = await retrieve.json()

        const { error } = await lands

        if (error) throw new Error(error)

        if (!lands.length) throw new Error('You have no lands yet!')

        return lands

    })()
}.bind(context)