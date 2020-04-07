const { validate } = require('hoort-utils')
const { models: { User, Land } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')
const bcrypt = require('bcryptjs')

module.exports = (id, password) => {

    validate.string(id, 'id')
    validate.string(password, 'password')

    let userLands = []

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotAllowedError(`wrong credentials`)

            return bcrypt.compare(password, user.password)
                .then(validPassword => {

                    if (!validPassword) throw new NotAllowedError(`wrong credentials`)

                    user.lands.forEach(land => userLands.push(land))

                    user.authenticated = new Date

                    return User.findByIdAndDelete(id)
                })
                .then(() => {
                    userLands.forEach(async _land => {

                        await Land.findByIdAndDelete(_land)
                    })
                })
                .then(() => { })
        })
}