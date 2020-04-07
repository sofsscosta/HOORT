const { validate } = require('hoort-utils')
const { models: { Land, User } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')

module.exports = async (name, userId, location, soiltype, scheme) => {

    validate.string(name, 'name')
    validate.string(userId, 'userId')
    validate.string(location, 'location')
    validate.string(soiltype, 'soiltype')
    if (scheme) validate.scheme(scheme)

    let user = await User.findById(userId)

    let landsNames = await Promise.all(user.lands.map(async _land => {
        let land = await Land.findById(_land)
        return land.name
    }))

    if (landsNames.includes(name)) throw new NotAllowedError(`You have already created a land with the name ${name}!`)

    _land = new Land({ name, userId, location, soiltype, scheme, created: new Date })

    let createdLand = await _land.save()

    await User.findByIdAndUpdate(userId, { $addToSet: { lands: createdLand.id } })

    return
}
