const config = require('../config')
const { updateLandHarvestVeggie, updateLandPlantVeggie, updateLandAddVeggie, createLand, registerUser, authenticateUser, createItem } = require('.')
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


describe('updateLandHarvestVeggie', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]
        return
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

    it('should succeed if veggie is added to land\'s plantation and is planted', async () => {

        await updateLandAddVeggie(landId, veggieId)
        await updateLandPlantVeggie(landId, veggieId)

        await updateLandHarvestVeggie(landId, veggieId)

        land = await Land.findById(landId)

        let plantation = land.plantation.find(plant => plant.veggie.toString() === veggieId.toString())

        expect(land.id).toBe(landId)
        expect(plantation).toBeDefined()
        expect(plantation.to).toBeInstanceOf(Date)
        expect(plantation.from).toBeInstanceOf(Date)
        expect(plantation.estTime).toBeDefined()
    })

    it('should fail if veggie is not yet planted', async () => {

        try {
            await updateLandAddVeggie(landId, veggieId)
            await updateLandHarvestVeggie(landId, veggieId)
        }
        catch (error) {
            expect(error.message).toBe('item is not planted yet')
        }
    })

    it('should fail if veggie is not on land\'s plantation', async () => {

        try {
            await updateLandHarvestVeggie(landId, veggieId)
        }
        catch (error) {
            expect(error.message).toBe('this item is not added to land')
        }
    })

    it('should fail if incorrect data is passed', async () => {

        try {
            await updateLandHarvestVeggie(`${landId}--wrong`, veggieId)
        } catch (error) {
            expect(error).toBeDefined()
        }

        try {
            await updateLandHarvestVeggie(`${landId}--wrong`, `${veggieId}--wrong`)
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