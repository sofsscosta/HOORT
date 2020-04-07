const { validate } = require('hoort-utils')
const { models: { Land, User } } = require('hoort-data')
const { NotFoundError } = require('../../hoort-errors')
const moment = require('moment')

module.exports = async (userId, landId) => {
    validate.string(userId, 'userId')
    validate.string(landId, 'landId')

    let land = await Land.findById(landId).lean()

    if (!land) throw new Error('This land doesn\'t exist')

    if (!land.plantation) throw new Error('This land isn\'t planted yet!')

    let user = await User.findById(userId)

    if (!user) throw new Error('This user doesn\'s exist')

    if (!user.lands.includes(landId)) throw new Error('This land doesn\'t belong to this user')

    land.plantation.forEach(plantation => {
        delete plantation._id
        plantation.to = moment(plantation.to).format('YYYY-MM-DD')
        plantation.from = moment(plantation.from).format('YYYY-MM-DD')
    })

    return land.plantation
}