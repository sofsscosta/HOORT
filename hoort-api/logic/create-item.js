const { validate } = require('hoort-utils')
const { models: { Land, Item } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')

// TODO add userId parameter
module.exports = (colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference) => {

    validate.string(colorId, 'colorId')
    validate.string(name, 'name')
    validate.string(type, 'type')
    validate.string(subtype, 'subtype')
    validate.string(growth, 'growth')
    validate.string(growthDuration, 'growthDuration')
    validate.string(soil, 'soil')
    validate.string(temperature, 'temperature')
    validate.string(bestPeriod, 'bestPeriod')
    validate.array(bestPeriodNum, 'bestPeriod')
    validate.string(lightPreference, 'lightPreference')

    // TODO find user by id (userId)
    // TODO check user exists and user role === 'admin', othwerwise throw error

    return Item.findOne({ name })
        .then(item => {
            if (item) throw new NotAllowedError(`item with name ${name} already exists`)

            else {
                item = new Item({ colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference })
                return item.save()
            }
        })
        .then(() => { })
}