const context = require('./context')

const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')


module.exports = function (changes) {

    Object.entries(changes).forEach(entry => {
        validate.string(entry[1], `${entry[0]}`)
    })

    if (!Object.keys(changes).length) throw new Error('No fields have been changed')


    return (async () => {

        const token = await this.storage.getItem('token')

        const response = await fetch(`${this.API_URL}/users`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ updates: changes })
        })

        if (response.status === 201) return

        const res = await response.json()

        const { error } = res

        if (error) throw new Error(error)
    })()

}.bind(context)