require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveUserLands, createLand, updateItemAdd } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Land, Item, User } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('retrieveUserLands', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
        userId, user, name, username, email, password,
        nameLand, location, soiltype, scheme, land, landId

    let lands = []

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
                for (let i = 0; i < 10; i++) {
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

                    lands.push(land)

                }
            })
    })

    it('should succeed on correct data', () =>
        retrieveUserLands(userId)
            .then(_lands => {
                for (let i = 0; i < lands.length; i++) {
                    expect(_lands[i].name).to.eql(lands[i].name)
                    expect(_lands[i].location).to.eql(lands[i].location)
                    expect(_lands[i].soiltype).to.eql(lands[i].soiltype)
                    expect(_lands[i].scheme).to.eql(lands[i].scheme)
                    expect(_lands[i].id).not.to.be.instanceof(Object)
                }
            })
    )

    it('should fail on invalid data', () =>
        expect(() => {
            retrieveUserLands(`${userId}--wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(NotFoundError, `user with id ${id} does not exist`)
                })
        })
    )

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})