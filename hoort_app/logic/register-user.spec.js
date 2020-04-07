const config = require('../config')
const registerUser = require('./register-user')
const { mongoose, models: { User } } = require('../hoort-data')
const { random } = Math
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const logic = require('.')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
MONGODB_URL = config.TEST_MONGODB_URL

describe('registerUser', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany({}))
    })

    let name, username, email, password

    beforeEach(() => {
        name = `name-${random()}`
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on new user', async () => {

        const response = await registerUser(name, username, email, password)

        expect(response).toBeUndefined()

        const user = await User.findOne({ email })
        expect(user).toBeDefined()
        expect(typeof user.id).toBe('string')
        expect(user.name).toBe(name)
        expect(user.username).toBe(username)
        expect(user.email).toBe(email)
        expect(user.created).toBeInstanceOf(Date)

        const validPassowrd = await bcrypt.compare(password, user.password)
        expect(validPassowrd).toBeTruthy()
    })

    describe('when user already exists', () => {

        it('should fail on already existing user', async () => {
            try {
                await registerUser(name, username, email, password)
                await registerUser(name, username, email, password)

                throw new Error('should not reach this point')
            } catch (error) {

                expect(error).toBeDefined()
                expect(error.message).toBe(`user with email ${email} already exists`)
            }
        })
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany({}))
        await mongoose.disconnect()
        return
    })
})
