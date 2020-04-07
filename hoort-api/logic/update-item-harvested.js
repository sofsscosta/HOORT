const { validate } = require('hoort-utils')
const { models: { Land, Item, User } } = require('hoort-data')
const { NotAllowedError, ContentError } = require('../../hoort-errors')
const { SchemaTypes: { ObjectId } } = require('mongoose')
const bcrypt = require('bcryptjs')

module.exports = async (userId, landId, itemId) => {
    validate.string(userId, 'userId')
    validate.string(landId, 'landId')
    validate.string(itemId, 'itemId')

    let land = await Land.findById(landId)

    let plantation = land.plantation.find(plant => plant.veggie.toString() === itemId)

    if (!plantation) throw new Error('this item is not added to land')

    if (plantation.from === null) throw new Error('item is not planted yet')

    plantation.to = new Date()

    let to = plantation.to
    let from = plantation.from

    plantation = plantation.toObject()
    delete plantation.estTime

    await land.save()

    let item = await Item.findById(itemId)

    let growthDuration = item.growthDuration.split('-')

    minDuration = Number(growthDuration[0])
    maxDuration = Number(growthDuration[1])

    userDuration = (from.getDate() + to.getDate()) / 2

    minDuration = Math.floor((minDuration + userDuration) / 2)
    maxDuration = Math.floor((maxDuration + userDuration) / 2)

    if (item.growthDurationAll)
        item.growthDurationAll = `${minDuration}-${maxDuration}`

    else item.growthDurationAll = item.growthDuration

    await item.save()

    return
}