const context = require('./context')

const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = function (name, location, soiltype, scheme) {
    validate.string(name, 'name')
    validate.string(location, 'location')
    validate.string(soiltype, 'soiltype')
    if (scheme) validate.scheme(scheme, true)

    return (async () => {

        const token = await this.storage.getItem('token')

        const response = await fetch(`${this.API_URL}/land`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, location, soiltype, scheme })
        })

        if (response.status === 201) return

        if (response.status !== 200) {
            return response.json()
                .then(response => {
                    const { error } = response

                    throw new Error(error)
                })
        } else throw new Error(response)
    })()
}.bind(context)