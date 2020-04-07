require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveItemForUser, createItem, createLand, updateItemAdd, updateItemPlanted, updateItemHarvested } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Item, User, Land } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('retrieveItemForUser', () => {

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
                }
            })
    })

    it('should succeed on correct data', async () => {
        for (let i = 0; i < veggies.length; i++) {
            return retrieveItemForUser(userId, veggies[i].id)
                .then(item => {
                    expect(item.constructor).to.equal(Object)
                    expect(item.lands[0]._id.toString()).to.eql(landId)
                    expect(item.growthDurationAll).to.exist
                })
        }
    })

    it('should display the average growth duration for the user if item has been harvested', async () => {
        await updateItemPlanted(userId, landId, veggies[0].id)
        await updateItemHarvested(userId, landId, veggies[0].id)

        let veg = await retrieveItemForUser(userId, veggies[0].id)

        let land = await Land.findById(landId)

        let plantation = land.plantation.find(plant => plant.veggie.toString() === veggies[0].id.toString())

        expect(veg.growthDurationUser).to.exist
        expect(veg.growthDurationUser).to.eql(Math.floor((plantation.to.getTime() - plantation.from.getTime()) / (1000 * 60 * 60 * 24)))
    })



    it('should fail on invalid user id', () =>
        expect(() => {
            return retrieveItemForUser(`${userId}--wrong`, veggies[0].id)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(NotFoundError, `user with id ${id} does not exist`)
                })
        })
    )

    it('should fail on invalid veggie id', () =>
        expect(() => {
            return retrieveItemForUser(userId, `${veggies[0].id}--wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(NotFoundError, `item with id ${veggies[0].id} does not exist`)
                })
        })
    )

    it('should fail if veggie is not on any land from user', () => {

        nameVeggie = `${nameVeggie}--other`

        veggie = new Item({ colorId, name: nameVeggie, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference })

        expect(() => {
            return retrieveItemForUser(userId, veggie)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(Error, 'this veggie is not on any land of this user')
                })
        })
    }

    )

    afterEach(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
        return await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})