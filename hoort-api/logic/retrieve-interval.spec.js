require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { updateItemAdd, createLand, retrieveInterval, updateItemPlanted, updateItemHarvested } = require('.')
const chai = require('chai')
const { mongoose, ISODate } = require('hoort-data')
const { models: { Land, Item, User } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const bcrypt = require('bcryptjs')
const moment = require('moment')

describe('retrieveInterval', () => {

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
        userId, user, name, username, email, password,
        nameLand, location, soiltype, scheme, land, landId

    let veggies = []

    beforeEach(async () => {

        type = 'type'

        for (let i = 0; i < 10; i++) {

            colorId = `colorId-${random()}`
            nameVeggie = `name-${random()}`
            type = `type-${random()}`
            subtype = `subtype-${random()}`
            growth = `growth-${random()}@mail.com`
            growthDuration = `${random()}-${random() + 10}`
            soil = `soil-${random()}`
            temperature = `temperature-${random()}`
            bestPeriod = `bestPeriod-${random()}`
            bestPeriodNum = [1, 2, 3]
            lightPreference = `lightPreference-${random()}`

            let veggie = new Item({ colorId, name: nameVeggie, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference })
            veggies.push(veggie)

        }
        await Item.insertMany(veggies)

        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()

        return bcrypt.hash(password, 10)
            .then(password =>
                User.create({ name, username, email, password })
            )
            .then(async _user => {
                userId = _user.id
                user = _user
            })
            .then(async () => {

                nameLand = `nameLand-${random()}`
                location = `location-${random()}`
                soiltype = `soiltype-${random()}`
                scheme = [[], [], [], [], []]

                for (let j = 0; j < scheme.length; j++)
                    for (let i = 0; i < 3; i++) {
                        scheme[j].push(veggies[i].id)
                    }
                await createLand(nameLand, userId, location, soiltype, scheme)

                land = await Land.findOne({ name: nameLand })
                landId = land.id


                for (let i = 0; i < 3; i++) {
                    await updateItemAdd(userId, landId, veggies[i].id)
                    await updateItemPlanted(userId, landId, veggies[i].id)

                    if (i === 3) return
                }

                return await land.save()
            })
    })

    it('should display correctly estimated time for harvesting', async () => {

        let interval = await retrieveInterval(userId, 3)

        let _land = await Land.findOne({ plantation: { $elemMatch: { veggie: veggies[0].id.toString() } } })

        expect(_land.plantation[0].estTime).to.exist
        expect(_land.plantation[0].estTime).to.exist

        var partsMax = interval[0].estMaxDay.split('/')
        var partsMin = interval[0].estMinDay.split('/')

        var max = new Date(partsMax[2], partsMax[1], partsMax[0])
        var min = new Date(partsMin[2], partsMin[1], partsMin[0])

        expect((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24) + 1).to.eql(7)
    })

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})