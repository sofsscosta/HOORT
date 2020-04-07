const { validate } = require('hoort-utils')
const { models: { Land, User } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')


module.exports = async (userId) => {
    validate.string(userId, 'userId')

    let results = []
    let user = await User.findById(userId)

    let lands = user.lands

    if (!lands) return new NotFoundError(`user doesn't have any lands`)

    for (let land of user.lands) {
        land = await Land.findById(land._id.toString())
        results.push({ id: land._id.toString(), name: land.name, location: land.location, soiltype: land.soiltype, scheme: land.scheme })
    }

    return results
}
