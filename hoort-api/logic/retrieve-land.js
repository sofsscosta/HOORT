const { validate } = require('hoort-utils')
const { models: { Land } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')

module.exports = (userId, landId) => {
    validate.string(userId, 'userId')
    validate.string(landId, 'landId')

    let land

    return Land.findById(landId).lean()
        .then(async _land => {

            land = _land

            if (!land) return new NotFoundError(`land with id ${landId} does not exist`)

            land.plantation.forEach(plant => {
                plant.id = plant._id.toString()
                delete plant._id
            })
            return land.plantation
        })
        .then(land => land)
        .then(plantation => {

            return { id: landId, name: land.name, location: land.location, soiltype: land.soiltype, scheme: land.scheme, plantation }
        })
}