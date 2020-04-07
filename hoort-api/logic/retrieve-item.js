const { validate } = require('hoort-utils')
const { models: { Item, Land } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')

module.exports = async (itemId) => {
    //if(userId) validate.string(userId, 'id')
    validate.string(itemId, 'itemId')

    let item = await Item.findById(itemId)

    if (!item) return new NotFoundError(`There\'s no item corresponding to this id!`)

    return { id: item._id.toString(), colorId: item.colorId, name: item.name, type: item.type, subtype: item.subtype, growth: item.growth, growthDuration: item.growthDuration, soil: item.soil, temperature: item.temperature, bestPeriod: item.bestPeriod, lightPreference: item.lightPreference }
}