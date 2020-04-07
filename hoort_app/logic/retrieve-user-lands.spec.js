const config = require('../config')
const { retrieveUserLands, updateLandAddVeggie, createLand, authenticateUser, registerUser, retrieveUser } = require('.')
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


describe('retrieveUserLands', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]

    })

    let userId, user, name, username, email, password, token

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
        })

        describe('when user has lands', () => {
            let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
                nameLand, location, soiltype, scheme, land, landId

            let veggies = [], lands = []

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
                    landId = land.id


                    for (let j = 0; j < veggies.length; j++) {

                        await updateLandAddVeggie(landId, veggies[j].id)
                    }
                    lands.push(land)
                }
            })

            afterEach(async () => {
                await User.deleteMany({})
                await Item.deleteMany({})
                return await Land.deleteMany({})
            })

            it('should succeed on correct data', async () => {
                let userLands = await retrieveUserLands()

                expect(userLands.length).toBe(10)

                for (let i = 0; i < lands.length; i++) {
                    expect(Object.keys(userLands[i]).length).toBe(5)
                    expect(userLands[i].id).toBe(lands[i].id)
                    expect(userLands[i].name).toBe(lands[i].name)
                    expect(userLands[i].location).toBe(lands[i].location)
                    expect(userLands[i].soiltype).toBe(lands[i].soiltype)
                    expect(userLands[i].scheme).toStrictEqual(lands[i].toObject().scheme)
                }
            })
        })


        it('should fail if user doesn\'t have any lands', async () => {
            try {
                await retrieveUserLands()
            }
            catch (error) {
                expect(error.message).toBe(`You don't have any lands yet!`)
            }
        })
    })


    it('should fail on invalid session', async () => {
        try {
            await retrieveUserLands()
        }
        catch (error) {
            expect(error).toBeDefined()
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