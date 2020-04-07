const { validate } = require('hoort-utils')
const { models: { User, Land, Item } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')

module.exports = async (userId) => {
    validate.string(userId, 'userId')

    let veggies = []
    let results = []
    let user = await User.findById(userId)

    let userLands = user.lands

    const lands = await Promise.all(userLands.map(async _land => {
        let land = await Land.findById(_land._id.toString())
        return land.toObject()
    }))

    for (let _land of lands) {

        _land.plantation.forEach(veggie => { if (!veggies.includes(veggie.veggie.toString())) veggies.push(veggie.veggie.toString()) })
    }

    for (let veggie of veggies) {

        let veg = await Item.findById(veggie)

        results.push({ id: veg.id, name: veg.name })
    }

    return results
}