const { validate } = require('hoort-utils')
const { models: { Land, Item } } = require('hoort-data')
const { NotAllowedError, ContentError } = require('../../hoort-errors')
const { SchemaTypes: { ObjectId } } = require('mongoose')
const bcrypt = require('bcryptjs')

module.exports = async (userId, landId, itemId, userTime) => {
    validate.string(userId, 'userId')
    validate.string(landId, 'landId')
    //validate.string(userTime, 'userTime')

    userTime = Number(userTime)

    let veggie, growthDuration, minDuration, maxDuration

    return Item.findById(itemId)
        .then(item => { //changing interval of max and min num of days till harvest // by adding user growth duration

            growthDuration = item.growthDuration

            let _growthDuration = item.growthDuration.split('-')

            minDuration = Number(_growthDuration[0])
            maxDuration = Number(_growthDuration[1])

            minDuration = (minDuration + userTime) / 2
            maxDuration = (maxDuration + userTime) / 2

            estimatedTime = `${minDuration}-${maxDuration}`

            item.growthDurationAll = estimatedTime

            return item.save()
        })
        .then(item => {

            if (!item.growthDurationUser) {

                return Item.findByIdAndUpdate(itemId, { $set: { growthDurationUser: userTime } })
                    .then(() => { })
            }

            else {
                let averageTime = (item.growthDurationUser + userTime) / 2
                return Item.findByIdAndUpdate(itemId, { $set: { growthDurationUser: averageTime } })
                    .then(() => { })
            }
        })
        .then(() => Land.findById(landId))
        .then(land => {

            //tenho que ter antes o tempo medio de vegetal para calcular quanto tempo falta até que usuario possa colher o fruto

            veggie = land.veggies.find(veggie => veggie._id.toString() === itemId)

            if (!veggie) throw new Error('this veggie is not on this land')

            if (land.veggies[land.veggies.indexOf(veggie)].state === 'planted') {

                land.veggies[land.veggies.indexOf(veggie)].userTime = userTime

                return land.save()
            }
        })
}