const context = require('./context')

const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')


module.exports = function (landId, scheme) {

    validate.string(landId, 'landId')

    return (async () => {
        const token = await this.storage.getItem('token')

        const response = await fetch(`${this.API_URL}/land/planted`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ land: landId, scheme })
        })

        const land = await response.json()

        const { error } = land

        if (error) throw new Error(error)

        else return land
    })()
}.bind(context)