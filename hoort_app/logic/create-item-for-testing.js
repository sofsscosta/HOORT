const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = function (colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference) {

    validate.string(name, 'name')
    validate.string(type, 'type')
    validate.string(subtype, 'subtype')
    validate.string(growth, 'growth')
    validate.string(growthDuration, 'growthDuration')
    validate.string(soil, 'soil')
    validate.string(temperature, 'temperature')
    validate.string(bestPeriod, 'bestPeriod')
    validate.string(lightPreference, 'lightPreference')

    return (async () => {

        const response = await fetch(`${this.API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference })
        })

        if (response.status === 201) {

            return
        }

        if (response.status !== 200) {
            return response.json()
                .then(response => {
                    const { error } = response

                    throw new Error(error)

                })
        } else throw new Error(response)
    })()
}.bind(context)