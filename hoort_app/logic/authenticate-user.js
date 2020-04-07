const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')
const context = require('./context')

module.exports = function (email, password) {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return (async () => {

        const auth = await fetch(`${this.API_URL}/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const res = await auth.json()

        const { error, token } = res

        if (error)
            throw new Error(error)

        else {
            await this.storage.setItem('token', token)
            return
        }
    })()
}.bind(context)