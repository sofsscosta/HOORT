const config = require('../config')
const { retrieveItemForUser, updateLandAddVeggie, createLand, authenticateUser, registerUser, retrieveUser, updateLandPlantVeggie } = require('.')
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
describe('retrieveItemForUser', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]

    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
        userId, user, name, username, email, password, token,
        nameLand, location, soiltype, scheme, land, landId

    let veggies = [], lands = []

    beforeEach(async () => {

        type = 'type'
        for (let i = 0; i < 5; i++) {

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
    })

    describe('when user is defined', () => {

        beforeEach(async () => {

            name = 'name-' + Math.random()
            username = 'username-' + Math.random()
            email = Math.random() + '@mail.com'
            password = 'password-' + Math.random()

            user = await User.create({ name, username, email, password })
            id = user._id.toString()
            const token = jwt.sign({ sub: id }, JWT_SECRET)
            await logic.__context__.storage.setItem('token', token)

            for (let i = 0; i < 5; i++) {
                nameLand = `nameLand-${random()}`
                location = `location-${random()}`
                soiltype = `soiltype-${random()}`
                scheme = [[], [], [], [], []]

                for (let j = 0; j < scheme.length; j++)
                    for (let i = 0; i < 3; i++) {
                        scheme[j].push(veggies[i].id)
                    }

                await createLand(nameLand, location, soiltype, scheme)

                land = await Land.findOne({ name: nameLand })
                landId = land.id


                for (let j = 0; j < veggies.length; j++) {

                    await updateLandAddVeggie(landId, veggies[j].id)
                    await updateLandPlantVeggie(landId, veggies[j].id)
                }
                lands.push(land)
            }
        })

        it('should succeed on correct data', async () => {
            for (let i = 0; i < veggies.length; i++) {
                for (let j = 0; j < lands.length; j++) {
                    let item = await retrieveItemForUser(veggies[i].id)

                    expect(item).toBeInstanceOf(Object)
                    expect(item[0][1][j]).toBe(lands[j].id)
                    expect(item[1][1]).toBeDefined()
                }
            }
        })
    })


    it('should fail on no user session', async () => {

        try {
            await retrieveItemForUser(veggies[0].id)
        }
        catch (error) {
            expect(error.message).toBe(`user with id ${id} does not exist`)
        }
    })

    afterEach(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
        return await Land.deleteMany({})
    })

    afterAll(async () => {
        await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]
        await logic.__context__.storage.clear()
        return await mongoose.disconnect()
    })
})