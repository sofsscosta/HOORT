const { validate } = require('hoort-utils')
const { models: { User } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')
const bcrypt = require('bcryptjs')

module.exports = (name, username, email, password) => {

    validate.string(name, 'name')
    validate.string(username, 'username')
    validate.email(email)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, username, email, password, created: new Date })

            return user.save()
        })
        .then(() => { })
}