const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')
const context = require('./context')

module.exports = function (name, username, email, password) {
    validate.email(email, 'email')
    validate.string(email, 'email')
    validate.string(name, 'name')
    validate.string(username, 'username')
    validate.string(password, 'password')

    return (async () => {

        const response = await fetch(`${this.API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, email, password })
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