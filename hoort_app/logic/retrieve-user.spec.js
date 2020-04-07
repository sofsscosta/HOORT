const config = require('../config')
const { retrieveUser } = require('.')
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

describe('retrieveUser', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await logic.__context__.storage.clear()
        return await Promise.resolve(User.deleteMany({}))
    })

    let name, username, email, password, id

    beforeEach(() => {
        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()
    })

    describe('when user already exists', () => {
        let token, user

        beforeEach(async () => {
            user = await User.create({ name, username, email, password })
            id = user._id.toString()
            const token = jwt.sign({ sub: id }, JWT_SECRET)
            await logic.__context__.storage.setItem('token', token)
        })

        afterEach(async () => {
            return await User.findByIdAndRemove(id)
        })

        it('should succeed on logged in user', async () => {

            retrievedUser = await retrieveUser()

            expect(retrievedUser.constructor).toBe(Object)
            expect(retrievedUser.name).toBe(name)
            expect(retrievedUser.username).toBe(username)
            expect(retrievedUser.email).toBe(email)
            expect(retrievedUser.password).toBeUndefined()
        })
    })

    it('should fail when there is no token in storage', async () => {

        try {
            await retrieveUser()
        } catch (error) {
            expect(error).toBeInstanceOf(TypeError)
            expect(error.message).toBe('invalid signature')
        }
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany({}))
        await logic.__context__.storage.clear()
        return await mongoose.disconnect()
    })
})