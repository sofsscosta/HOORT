const { validate } = require('hoort-utils')
const { models: { Land } } = require('hoort-data')

module.exports = async (userId, landId, scheme) => {
        validate.string(userId, 'userId')
        validate.string(landId, 'landId')
        validate.scheme(scheme)

        let land = await Land.findById(landId)

        if (!land) throw new Error('This land doesn\'t exist')

        if (scheme.length === land.scheme.length) {
                land.scheme = scheme

                await land.save()

                land = land.toObject()

                land.plantation.forEach(plant => {
                        plant.id = plant._id.toString()
                        delete plant._id
                })

                land.id = land._id.toString()
                delete land._id
                delete land.__v

                return land
        }

        else throw new Error('Scheme divisions differ from original')

}