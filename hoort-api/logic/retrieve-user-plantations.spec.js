require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveUserPlantations, createItem, createLand, updateItemAdd, updateItemPlanted, updateItemHarvested } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Item, User, Land } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('retrieveUserPlantations', () => {

    before(() => {
        return mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Item.deleteMany({})).then(() => { })
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
            growthDuration = `growthDuration-${random()}`
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
                user = await User.findById(userId)
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
                }

                for (let i = 0; i < 2; i++) {
                    await updateItemPlanted(userId, landId, veggies[i].id)
                }

                for (let i = 0; i < 1; i++) {
                    await updateItemHarvested(userId, landId, veggies[i].id)
                }
            })
    })


    it('should succeed on correct data', () =>
        retrieveUserPlantations(userId)
            .then(results => {
                expect(results.length).to.equal(3)
                expect(results[0].to).to.be.instanceof(Date)
                expect(results[0].from).to.be.instanceof(Date)
                expect(results[0].estTime).to.exist

                expect(results[1].to).to.be.null
                expect(results[1].from).to.be.instanceof(Date)

                expect(results[2].to).to.be.null
                expect(results[2].from).to.be.null
            })
    )

    it('should fail on invalid id', () =>
        expect(() => {
            retrieveUserPlantations(undefined, `${id}--wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(NotFoundError, `user with id ${id} does not exist`)
                })
        })
    )

    afterEach(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
        return await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})