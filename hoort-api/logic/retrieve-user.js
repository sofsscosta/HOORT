const { validate } = require('hoort-utils')
const { models: { User } } = require('hoort-data')
const moment = require('moment')
const { NotFoundError, NotAllowedError } = require('../../hoort-errors')

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id)
        .then(user => {
            if (!user) return new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) return new NotAllowedError(`user with id ${id} is deactivated`)
            user.retrieved = moment().format('Y-MM-DD HH:mm:ss.SSS')

            return user.save()
        })
        .then(({ name, username, email }) => ({ name, username, email }))
}