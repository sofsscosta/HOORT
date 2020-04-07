const { validate } = require('hoort-utils')
const { models: { Land } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')
const { SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = async (id, landId, itemId) => {

    validate.string(id, 'id')
    validate.string(landId, 'landId')
    validate.string(itemId, 'itemId')

    let land = await Land.findById(landId)

    let plantedVeggie = land.plantation.find(plant => plant.veggie.toString() === itemId)

    let isThere = land.scheme.find(line => line.includes(plantedVeggie))

    if (isThere) return

    else if (land.plantation.find(plant => plant.veggie.toString() === itemId) !== undefined) {

        land.plantation.splice(land.plantation.indexOf(plantedVeggie), 1)

        await land.save()

        return
    }

    else throw new Error('this veggie is neither on this land nor on this land\'s plantation')
}