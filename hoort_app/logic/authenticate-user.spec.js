const config = require('../config')
const { mongoose, models: { User } } = require('../hoort-data')
const { authenticateUser, retrieveUser } = require('./')
const bcrypt = require('bcryptjs')
const logic = require('.')
const AsyncStorage = require('not-async-storage')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
logic.__context__.storage = AsyncStorage

MONGODB_URL = config.TEST_MONGODB_URL

describe('authenticateUser', () => {

    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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

        let _id, user, _password

        beforeEach(async () => {

            _password = await bcrypt.hash(password, 10)

            user = await User.create({ name, username, email, password: _password })

            return _id = user.id
        })

        it('should succeed on correct credentials', async () => {

            let response = await authenticateUser(email, password)

            expect(response).toBeUndefined()

            const token = await logic.__context__.storage.getItem('token')

            let _user = await retrieveUser(token)

            expect(_user.email).toBe(user.email)
            expect(_user.name).toBe(user.name)
            expect(_user.username).toBe(user.username)

        })

        it('should fail on incorrect password', async () => {

            try {
                await authenticateUser(email, `${password}--wrong`)
            } catch (error) {
                expect(error.message).toBe(`wrong credentials`)
            }

        })

        afterEach(async () => {
            return await User.deleteOne({ _id: _id })
        })
    })

    it('should fail when user does not exist', async () => {

        email = '11111@mail.com'

        try {
            await authenticateUser(email, password)
        } catch (error) {
            expect(error.message).toBe('wrong credentials')
        }


    })

    afterEach(async () => {
        return await User.deleteOne({ _id: id })
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany({}))
        return await mongoose.disconnect()
    })
})