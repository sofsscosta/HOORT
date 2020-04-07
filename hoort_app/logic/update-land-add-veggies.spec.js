const config = require('../config')
const { updateLandAddVeggie, createLand, registerUser, authenticateUser, createItem } = require('.')
const { mongoose, models: { Item, User, Land } } = require('../hoort-data')
const { random } = Math
const jwt = require('jsonwebtoken')

const logic = require('.')
const AsyncStorage = require('not-async-storage')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
logic.__context__.storage = AsyncStorage

TEST_MONGODB_URL = config.TEST_MONGODB_URL
JWT_SECRET = config.TEST_JWT_SECRET

describe('updateLandAddVeggie', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]
    })

    let name, username, email, password, token,
        nameLand, location, soiltype, scheme, land, landId
    let veggie, veggieId, colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference
    let veggies = [], lands = []

    beforeEach(async () => {

        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()

        user = await User.create({ name, username, email, password })
        id = user._id.toString()
        const token = jwt.sign({ sub: id }, JWT_SECRET)
        await logic.__context__.storage.setItem('token', token)

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

        await createItem(colorId, nameVeggie, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference)

        veggie = await Item.findOne({ name: nameVeggie })
        veggieId = veggie.id

        nameLand = `nameLand-${random()}`
        location = `location-${random()}`
        soiltype = `soiltype-${random()}`
        scheme = [[], [], [], [], []]

        for (let j = 0; j < scheme.length; j++)
            for (let i = 0; i < 3; i++) {
                scheme[j].push(false)
            }

        await createLand(nameLand, location, soiltype, scheme)

        land = await Land.findOne({ name: nameLand })
        landId = land.id
    })

    it('should add veggies to land\'s plantation if it exists on scheme', async () => {

        await updateLandAddVeggie(landId, veggieId)

        land = await Land.findById(landId)

        let plantation = land.plantation.find(plant => plant.veggie.toString() === veggieId.toString())

        expect(land.id).toBe(landId)
        expect(plantation).toBeDefined()
        expect(plantation.to).toBe(null)
        expect(plantation.from).toBe(null)
    })

    it('should not add to plantation if there is already a plantation for this veggie ', async () => {

        await updateLandAddVeggie(landId, veggieId)
        await updateLandAddVeggie(landId, veggieId)

        land = await Land.findById(landId)

        let plantation = land.plantation.filter(plant => plant.veggie.toString() === veggieId.toString())
        expect(plantation.length).toBe(1)
    })

    it('should fail if incorrect data is passed', async () => {

        try {
            await updateLandAddVeggie(`${landId}--wrong`, veggieId)
        } catch (error) {
            expect(error).toBeDefined()
        }

        try {
            await updateLandAddVeggie(`${landId}--wrong`, `${veggieId}--wrong`)
        } catch (error) {
            expect(error).toBeDefined()
        }
    })

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    afterAll(async () => {
        await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]
        await logic.__context__.storage.clear()
        return await mongoose.disconnect()
    })
})