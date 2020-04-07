const context = require('./context')

const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = function (land, token) {
    validate.string(land, 'land')

    return (async () => {

        const token = await this.storage.getItem('token')

        const response = await fetch(`${this.API_URL}/land`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ land })
        })

        if (response.status === 200) {
            return
        }

        if (response.status !== 200) {

            let res = await response.json()

            const { error } = res

            throw new Error(error)

        } else throw new Error(response)
    })()
}.bind(context)