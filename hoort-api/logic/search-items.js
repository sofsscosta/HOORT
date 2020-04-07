const { validate } = require('hoort-utils')
const { models: { Item } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')

module.exports = async (query) => {
    validate.string(query, 'query')

    query = query.toLowerCase()

    let results = await Item.find({ $or: [{ name: { $regex: query } }, { type: { $regex: query } }, { subtype: { $regex: query } }, { growth: { $regex: query } }, { growthDuration: { $regex: query } }, { soil: { $regex: query } }, { bestPeriod: { $regex: query } }, { temperature: { $regex: query } }, { lightPreference: { $regex: query } }] })

    if (!results.length) throw new NotFoundError('There are no results for your search :(')

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