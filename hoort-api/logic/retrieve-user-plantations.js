const { validate } = require('hoort-utils')
const { models: { Land, User } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')


module.exports = async (userId) => {
    validate.string(userId, 'userId')

    let results = []
    let user = await User.findById(userId)

    if (!user) throw new NotFoundError('User does not exist')

    // if (!lands) return new NotFoundError(`user doesn't have any lands`)

    for (let land of user.lands) {
        land = await Land.findById(land._id.toString())

        land.plantation.forEach(plant => {

            plant = plant.toObject()
            plant.land = land._id.toString()
            plant.id = plant._id.toString()
            delete plant._id

            return results.push(plant)
        })
    }

    // if (!results.length) throw new NotFoundError(`You haven't planted anything yet!`)

    return results
}
