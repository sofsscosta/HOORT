require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { createLand, updateItemPlanted } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Land, Item, User } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const bcrypt = require('bcryptjs')
const moment = require('moment')

describe('updateItemPlanted', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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
                    land.plantation.push({ veggie: veggies[i].id })
                }
                await land.save()
            })
    })

    it('should add veggie to lands\' plantations', async () => {
        await updateItemPlanted(userId, landId, veggies[0].id.toString())

        let _land = await Land.findOne({ plantation: { $elemMatch: { veggie: veggies[0].id.toString() } } })

        expect(_land.plantation[0].from).to.exist
        expect(_land.plantation[0].from).to.be.instanceOf(Date)
        expect(_land.plantation[0].to).to.be.null
        expect(_land.plantation[0].to).to.be.null
        expect(_land.plantation[0].estTime).to.be.string

        // let today = moment().format('DD/MM/YYYY')

        // let day = Number(today.split('/')[0])
        // let month = Number(today.split('/')[1])
        // let year = Number(today.split('/')[2])

        // expect(_land.plantation[0].estTime).to.eql(`${moment().format('DD/M/YYYY')}-${day + 10}/${month}/${year}`)
    })

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})