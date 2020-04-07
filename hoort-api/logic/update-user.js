const { validate } = require('hoort-utils')
const { models: { User } } = require('hoort-data')
const { NotAllowedError, ContentError } = require('../../hoort-errors')
const { SchemaTypes: { ObjectId } } = require('mongoose')
const bcrypt = require('bcryptjs')

module.exports = async (id, updates) => {
    validate.string(id, 'id')

    const user = await User.findById(id)

    if (user.id !== id) throw new NotAllowedError('Wrong user!')

    const password = user.password

    const VALID_KEYS = ['name', 'username', 'email', 'oldPassword', 'newPassword']
    let approvedUpdates = {}

    for (key in updates) {
        if (!(VALID_KEYS.includes(key))) throw new NotAllowedError(`invalid field ${key}`)

        if (key === 'oldPassword') {

            if (!updates['newPassword'])
                throw new ContentError('Please insert your new password')

            let validPassword = await bcrypt.compare(updates[key], password)
            if (!validPassword) throw new NotAllowedError(`Wrong credentials`)
        }

        if (key === 'newPassword')

            if (!updates['oldPassword'])
                throw new ContentError('Please insert your old password')

        approvedUpdates['password'] = await bcrypt.hash(updates[key], 10)

        if (updates[key] !== '' && updates[key] !== 'oldPassword' && updates[key] !== 'newPassword') {
            approvedUpdates[key] = updates[key]

        } else {
            throw new ContentError(`field ${key} is empty`)
        }
    }

    delete approvedUpdates['oldPassword']
    delete approvedUpdates['newPassword']

    await User.findByIdAndUpdate(id, { $set: approvedUpdates })

    return
}