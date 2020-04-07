const { validate } = require('hoort-utils')
const { models: { Item, Land } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')

module.exports = async (userId, itemId) => {
    validate.string(userId, 'userId')
    validate.string(itemId, 'itemId')

    let to, from, growthDurationUser

    let item = await Item.findById(itemId)

    // if (!item) return new NotFoundError(`item with id ${itemId} does not exist`)

    //let growthDuration = item.growthDuration

    let growthDurationAll = item.growthDurationAll ? item.growthDurationAll : item.growthDuration

    let lands = await Land.find({ userId, plantation: { $elemMatch: { veggie: itemId } } }).lean()

    if (!lands) throw new Error('this veggie is not on any land of this user')

    let userLands = []

    lands.forEach(land => {

        let veggie = land.plantation.find(plant => plant.veggie.toString() === itemId)
        if (veggie.to && veggie.from) {
            to = veggie.to
            from = veggie.from
        }

        if (to && from) growthDurationUser = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

        userLands.push(land._id)
    })

    return { lands: userLands, /*growthDuration,*/ growthDurationAll, growthDurationUser }
}