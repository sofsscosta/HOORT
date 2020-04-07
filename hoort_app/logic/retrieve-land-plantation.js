const context = require('./context')
const { validate } = require('../hoort-utils')
const fetch = require('node-fetch')

module.exports = async function (id) {
    validate.string(id, 'id')

    const token = await this.storage.getItem('token')

    const retrieve = await fetch(`${this.API_URL}/land/planted/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': `application/json`, 'Authorization': `Bearer ${token}` }
    })

    const item = await retrieve.json()

    const { error } = await item

    if (error) throw new Error(error)

    if (!item) throw new Error('There\'s no item corresponding to this id!')

    return item
}.bind(context)