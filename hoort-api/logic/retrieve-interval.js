const { validate } = require('hoort-utils')
const { models: { Land, User, Item } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')
const moment = require('moment')

module.exports = async (userId, month) => {
    validate.string(userId, 'id')
    //validate.string(month, 'month')

    let veggiesEstTime = []

    let user = await User.findById(userId)

    for (let i = 0; i < user.lands.length; i++) {

        let land = await Land.findById(user.lands[i])

        for (let plant of land.plantation) {

            if (plant.from !== null) {

                let from = plant.from

                let veggie = await Item.findById(plant.veggie.toString())

                let days = veggie.growthDuration.split('-')
                let averageDay = Math.floor((Number(days[0]) + Number(days[1])) / 2)

                let estAverageDay = from.setDate(from.getDate() + averageDay)

                let estMinDay = moment(estAverageDay).subtract(3, 'days').format('DD/MM/YYYY')

                let estMaxDay = moment(estAverageDay).add(4, 'days').format('DD/MM/YYYY')

                veggiesEstTime.push({ veggie: plant.veggie.toString(), estMinDay, estMaxDay })
            }
        }
    }

    return veggiesEstTime
}