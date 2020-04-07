const config = require('../config')
const { createLand } = require('.')
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

describe('createLand', () => {

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
        id = user._id.toString()
        const _token = jwt.sign({ sub: id }, JWT_SECRET)
        await logic.__context__.storage.setItem('token', _token)

        nameLand = `nameLand-${random()}`
        location = `location-${random()}`
        soiltype = `soiltype-${random()}`
        scheme = [[], [], [], [], []]

        for (let j = 0; j < scheme.length; j++)
            for (let i = 0; i < 3; i++) {
                scheme[j].push(false)
            }
    })

    it('should succeed on creating new land if all fields are correctly filled', async () => {

        await createLand(nameLand, location, soiltype, scheme)

        land = await Land.findOne({ name: nameLand })

        expect(land.name).toBe(nameLand)
        expect(land.location).toBe(location)
        expect(land.soiltype).toBe(soiltype)
        expect(land.toObject().scheme).toStrictEqual(scheme)
    })

    it('should fail on repeated name from list of user\'s lands', async () => {

        try {
            await createLand(nameLand, location, soiltype, scheme)
            await createLand(nameLand, `${location}-2`, `${soiltype}-2`, scheme)
        }
        catch (error) {
            expect(error.message).toBe(`You have already created a land with the name ${nameLand}!`)
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
