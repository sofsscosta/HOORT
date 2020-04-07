const context = require('./context')

const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = function (operation, scheme) {
    validate.string(operation, 'operation')

    if (scheme.length === 20 && operation === '+') throw new Error('Max limit of divisions!')
    if (scheme.length === 5 && operation === '-') throw new Error('Min limit of divisions!')

    return (async () => {

        const response = await fetch(`${this.API_URL}/land/divisions`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation, scheme })
        })

        const newScheme = await response.json()

        const { error } = response

        if (error) throw new Error(error)

        else return newScheme

    })()
}.bind(context)