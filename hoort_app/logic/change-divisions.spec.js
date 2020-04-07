const config = require('../config')
const { changeDivisions, updateLandAddVeggie, createLand, registerUser, retrieveUser, updateLandPlantVeggie } = require('.')
const { mongoose, models: { Item, User, Land } } = require('../hoort-data')
const bcrypt = require('bcryptjs')
const { random } = Math
const jwt = require('jsonwebtoken')

const logic = require('.')
const AsyncStorage = require('not-async-storage')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
logic.__context__.storage = AsyncStorage

TEST_MONGODB_URL = config.TEST_MONGODB_URL
JWT_SECRET = config.TEST_JWT_SECRET

describe('changeDivisions', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve[Item.deleteMany({}), User.deleteMany({}), Item.deleteMany({})]

    })

    let userId, user, name, username, email, password, token,
        nameLand, location, soiltype, scheme, land, landId

    beforeEach(async () => {

        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()

        user = await User.create({ name, username, email, password })
        userId = user.id
        token = jwt.sign({ sub: userId }, JWT_SECRET)
        await logic.__context__.storage.setItem('token', token)

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

    it('should succeed on increasing divisions if operation is \'+\'', async () => {

        let newScheme = await changeDivisions('+', land.scheme)

        expect(newScheme.length).toBe(10)

        for (let line of newScheme) {
            expect(line.length).toBe(6)
        }

        let _newScheme = await changeDivisions('+', newScheme)

        expect(_newScheme.length).toBe(20)

        for (let line of _newScheme) {
            expect(line.length).toBe(12)
        }
    })

    it('should succeed on increasing divisions if operation is \'+\'', async () => {

        let newScheme = await changeDivisions('+', land.scheme)
        let _newScheme = await changeDivisions('+', newScheme)

        let smallerScheme = await changeDivisions('-', _newScheme)

        expect(smallerScheme.length).toBe(10)

        for (let line of smallerScheme) {
            expect(line.length).toBe(6)
        }

        let _smallerScheme = await changeDivisions('-', smallerScheme)

        expect(_smallerScheme.length).toBe(5)

        for (let line of _smallerScheme) {
            expect(line.length).toBe(3)
        }
    })

    it('should fail on max number of divisions reached', async () => {
        try {
            let newScheme = await changeDivisions('+', land.scheme)
            let _newScheme = await changeDivisions('+', newScheme)
            let __newScheme = await changeDivisions('+', _newScheme)
        }
        catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBe('Max limit of divisions!')
        }
    })

    it('should fail on min number of divisions reached', async () => {
        try {
            let newScheme = await changeDivisions('-', land.scheme)
        }
        catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBe('Min limit of divisions!')
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