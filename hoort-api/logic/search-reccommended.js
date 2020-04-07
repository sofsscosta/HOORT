const { validate } = require('hoort-utils')
const { models: { Item } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')

module.exports = async () => {

    let month = new Date().getMonth()

    let results = await Item.find({ $or: [{ bestPeriodNum: month }] })

    if (!results.length) throw new Error('There are no veggies in season in our database :(')

    results = await Promise.all(results.map(result => {

        return {
            id: result._id.toString(),
            colorId: result.colorId,
            name: result.name,
            type: result.type,
            subtype: result.subtype,
            growth: result.growth,
            growthDuration: result.growthDuration,
            soil: result.soil,
            temperature: result.temperature,
            bestPeriod: result.bestPeriod,
            bestPeriodNum: result.bestPeriodNum,
            lightPreference: result.lightPreference,
            growthDurationAll: result.growthDurationAll
        }
    }))

    return results
}