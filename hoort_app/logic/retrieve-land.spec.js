const config = require('../config')
const { retrieveLand, updateLandAddVeggie, createLand, authenticateUser, registerUser, retrieveUser, updateLandPlantVeggie } = require('.')
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


describe('retrieveLand', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]

    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
        userId, user, name, username, email, password, token,
        nameLand, location, soiltype, scheme, land, landId

    let veggies = [], lands = []


    describe.only('whe user is logged in', () => {

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

            user = await User.create({ name, username, email, password })
            id = user._id.toString()
            const token = jwt.sign({ sub: id }, JWT_SECRET)
            await logic.__context__.storage.setItem('token', token)

            for (let i = 0; i < 10; i++) {
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
                lands.push(land)
            }
            landId = lands[0].id
        })

        it('should succeed on logeed in user and land id', async () => {
            for (let i = 0; i < lands.length; i++) {
                let land = await retrieveLand(lands[i].id)

                expect(land).toBeDefined()
                expect(land).toBeInstanceOf(Object)
                expect(land.name).toBe(lands[i].name)
                expect(land.location).toBe(lands[i].location)
                expect(land.soiltype).toBe(lands[i].soiltype)
                expect(land.scheme).toStrictEqual(lands[i].toObject().scheme)
            }
        })

        it('should fail on invalid id', async () => {
            try {
                await retrieveLand(`${lands[0].id}--wrong`)
            }
            catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    it('should fail on invalid user session', async () => {

        try {
            await retrieveLand(landId)
        }
        catch (error) {
            expect(error.message).toBe(`invalid signature`)
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