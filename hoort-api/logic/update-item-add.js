const { validate } = require('hoort-utils')
const { models: { Land, Item, User } } = require('hoort-data')
const { NotAllowedError, ContentError } = require('../../hoort-errors')

module.exports = async (userId, landId, itemId) => {
    validate.string(userId, 'userId')
    validate.string(landId, 'landId')
    validate.string(itemId, 'itemId')

    let veggie = await Item.findById(itemId)

    if (!veggie) throw new ContentError('item does not exist')

    let land = await Land.findById(landId).lean()

    if (!land) throw new ContentError('land does not exist')

    if (
        land.plantation.find(item =>
            item.veggie.toString() === itemId
        ) !== undefined) {

        land.id = land._id.toString()
        delete land._id
        delete land.__v

        land.plantation.forEach(plant => {
            plant.id = plant._id.toString()
            delete plant._id
        })

        return
    }

    else {
        await Land.findByIdAndUpdate(landId, { $addToSet: { plantation: { veggie: itemId } } })
        return
    }
}