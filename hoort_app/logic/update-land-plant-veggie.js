const context = require('./context')

const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = function (landId, veggieId) {
    validate.string(landId, 'landId')
    validate.string(veggieId, 'veggieId')

    return (async () => {

        const token = await this.storage.getItem('token')

        const response = await fetch(`${this.API_URL}/item/planted`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ land: landId, item: veggieId })
        })

        if (response.status === 201) {
            return
        }

        else {
            const { error } = await response.json()

            throw new Error(error)
        }
    })()
}.bind(context)