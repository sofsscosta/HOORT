require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveLandPlantations, createLand, updateItemAdd } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Land, Item, User } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe.only('retrieveLandPlantations', () => {

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
                land = await Land.findById(landId)
                return land
            })
    })

    it('should succeed on correct data', () =>
        retrieveLandPlantations(userId, landId)
            .then(plantation => {
                expect(plantation[0].veggie.toString()).to.eql(veggies[0].id)
                expect(plantation[0].to).to.eql(null)
                expect(plantation[0].from).to.eql(null)
            })
    )

    it('should fail on invalid data', () => {

        expect(() => {
            retrieveLandPlantations(`${userId}--wrong`, landId)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(Error, `user with id ${id} does not exist`)
                })
        })

        expect(() => {
            retrieveLandPlantations(userId, `${landId}--wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(Error, `This land doesn\'t exist`)
                })
        })
    })

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})