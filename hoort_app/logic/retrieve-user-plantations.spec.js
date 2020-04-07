const config = require('../config')
const { retrieveUserPlantations, updateLandAddVeggie, createLand, authenticateUser, registerUser, retrieveUser, updateLandPlantVeggie } = require('.')
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

describe('retrieveUserPlantations', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]
    })

    let userId, user, name, username, email, password, token

    describe('when user is not defined', () => {

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

            let veggies = [], lands = [], plantations = []

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

                for (let i = 0; i < 5; i++) {
                    nameLand = `nameLand-${random()}`
                    location = `location-${random()}`
                    soiltype = `soiltype-${random()}`
                    scheme = [[], [], [], [], []]

                    for (let j = 0; j < scheme.length; j++)
                        for (let i = 0; i < veggies.length; i++) {
                            scheme[j].push(veggies[i].id)
                        }

                    await createLand(nameLand, location, soiltype, scheme)

                    land = await Land.findOne({ name: nameLand })
                    landId = land.id

                    for (let j = 0; j < 5; j++) {
                        await updateLandAddVeggie(landId, veggies[j].id)
                    }
                    land = await Land.findOne({ name: nameLand })

                    for (let k = 0; k < land.plantation.length; k++) {
                        plantations.push(land.plantation[k])
                    }

                    lands.push(land)
                }
            })

            afterEach(async () => {
                await User.deleteMany({})
                await Item.deleteMany({})
                return await Land.deleteMany({})
            })

            it('should return user\'s plantations on correct data', async () => {
                let userPlantations = await retrieveUserPlantations()

                expect(userPlantations.length).toBe(25)

                for (let i = 0; i < lands.length; i++) {

                    expect(Object.entries(userPlantations[i]).length).toBe(5)
                    expect(plantations[i].to).toBe(userPlantations[i].to)
                    expect(plantations[i].from).toBe(userPlantations[i].from)
                    expect(plantations[i].veggie.toString()).toBe(userPlantations[i].veggie.toString())
                }
            })
        })



        it('should fail if user doesn\'t have any lands', async () => {
            try {
                await retrieveUserPlantations()
            }
            catch (error) {
                expect(error.message).toBe(`You have no lands yet!`)
            }
        })
    })


    it('should fail on not logged in user', async () => {
        try {
            await retrieveUserPlantations()
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