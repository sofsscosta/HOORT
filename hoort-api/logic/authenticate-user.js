const { validate } = require('hoort-utils')
const { models: { User } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')
const bcrypt = require('bcryptjs')

module.exports = (email, password) => {

    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (!user) throw new NotAllowedError(`wrong credentials`)

            return bcrypt.compare(password, user.password)
                .then(validPassword => {

                    if (!validPassword) throw new NotAllowedError(`wrong credentials`)

                    user.authenticated = new Date

                    return user.save()
                })
                .then(({ id }) => id)
        })
}