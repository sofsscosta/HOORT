const config = require('../config')
const { retrieveUserVeggies, updateLandAddVeggie, createLand, authenticateUser, registerUser, retrieveUser, updateLandPlantVeggie } = require('.')
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

describe('retrieveUserVeggies', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]
    })

    let userId, user, name, username, email, password, token

    describe('when user exists', () => {

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

            let lands = []

            beforeEach(async () => {

                for (let i = 0; i < 5; i++) {
                    nameLand = `nameLand-${random()}`
                    location = `location-${random()}`
                    soiltype = `soiltype-${random()}`
                    scheme = [
                        [false, false, false, false, false],
                        [false, false, false, false, false],
                        [false, false, false, false, false],
                        [false, false, false, false, false],
                        [false, false, false, false, false],
                    ]

                    await createLand(nameLand, location, soiltype, scheme)

                    land = await Land.findOne({ name: nameLand })
                    landId = land.id

                    lands.push(land)
                }
            })

            afterEach(async () => {
                await User.deleteMany({})
                await Item.deleteMany({})
                return await Land.deleteMany({})
            })

            it('should return no results if user hasn\'t planted anything', async () => {
                let userVeggies = await retrieveUserVeggies()

                expect(userVeggies.length).toBe(0)
            })

            describe('when user has planted veggies in lands', () => {

                let veggies = [], plantedLands = []

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

                    for (land of lands) {

                        for (let j = 0; j < scheme.length; j++) {
                            scheme[j] = []
                            for (let i = 0; i < veggies.length; i++) {
                                scheme[j].push(veggies[i].id)
                            }
                        }
                        for (let j = 0; j < 10; j++) {
                            await updateLandAddVeggie(landId, veggies[j].id)
                        }
                        land = await Land.findOne({ name: nameLand })

                        plantedLands.push(land)
                    }
                })

                it('should return user\'s veggies', async () => {
                    let userVeggies = await retrieveUserVeggies()

                    expect(userVeggies.length).toBe(veggies.length)

                    for (let i = 0; i < userVeggies.length; i++) {
                        expect(userVeggies[i].id).toBe(veggies[i].id)
                        expect(userVeggies[i].name).toBe(veggies[i].name)
                    }
                })

                afterEach(async () => {
                    await User.deleteMany({})
                    await Item.deleteMany({})
                    return await Land.deleteMany({})
                })
            })
        })

        it('should fail if user doesn\'t have any lands', async () => {
            try {
                await retrieveUserVeggies()
            }
            catch (error) {
                expect(error.message).toBe(`You have no lands yet!`)
            }
        })
    })


    it('should fail on not logged in user', async () => {
        try {
            await retrieveUserVeggies()
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