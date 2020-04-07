const config = require('../config')
const { updateUser } = require('.')
const { mongoose, models: { User } } = require('../hoort-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const logic = require('.')
const AsyncStorage = require('not-async-storage')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
logic.__context__.storage = AsyncStorage

TEST_MONGODB_URL = config.TEST_MONGODB_URL
JWT_SECRET = config.TEST_JWT_SECRET

describe('updateUser', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany({}))
    })

    let name, username, email, password, _password, id

    beforeEach(async () => {
        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()

    })

    describe('when user already exists', () => {
        let token, user, newName, newUsername, newEmail, newPassword, updates

        beforeEach(async () => {

            _password = await bcrypt.hash(password, 10)
            user = await User.create({ name, username, email, password: _password })
            id = user.id
            token = jwt.sign({ sub: id }, JWT_SECRET)
            await logic.__context__.storage.setItem('token', token)


            newName = 'newName-' + Math.random()
            newUsername = 'newUsername-' + Math.random()
            newEmail = 'newMail-' + Math.random() + '@mail.com'
            newPassword = 'newPassword-' + Math.random()
        })

        afterEach(async () => {
            return await User.findByIdAndRemove(id)
        })

        it('should succeed on correct token and all fields filled', async () => {
            updates = { name: newName, username: newUsername, email: newEmail, oldPassword: password, newPassword }

            let response = await updateUser(updates, token)

            expect(response).toBeUndefined()

            let retrievedUser = await User.findById(id)

            expect(retrievedUser.name).toBe(newName)
            expect(retrievedUser.username).toBe(newUsername)
            expect(retrievedUser.email).toBe(newEmail)

            const isValid = await bcrypt.compare(newPassword, retrievedUser.password)
            expect(isValid).toBe(true)
        })

        it('should succeed on correct token and some fields filled', async () => {
            updates = { email: newEmail, oldPassword: password, newPassword }

            let response = await updateUser(updates)

            expect(response).toBeUndefined()

            let retrievedUser = await User.findById(id)

            expect(retrievedUser.name).toBe(name)
            expect(retrievedUser.username).toBe(username)
            expect(retrievedUser.email).toBe(newEmail)

            const isValid = await bcrypt.compare(newPassword, retrievedUser.password)
            expect(isValid).toBe(true)

        })

        it('should fail on invalid token', async () => {
            updates = { email: newEmail, oldPassword: password, newPassword }

            try {
                await updateUser(updates, `${token}--wrong`)
            } catch (error) {
                expect(error.message).toBe("invalid signature")
            }
        })

        it('should fail on invalid update fields', async () => {
            updates = { email: newEmail, wrongField: name, oldPassword: password, newPassword }

            try {
                await updateUser(updates)
            } catch (error) {
                expect(error.message).toBe("invalid field wrongField")
            }
        })
    })

    describe('when user does not exist', () => {

        let token, user, newName, newUsername, newEmail, newPassword, updates

        beforeEach(async () => {

            newName = 'newName-' + Math.random()
            newUsername = 'newUsername-' + Math.random()
            newEmail = 'newMail-' + Math.random() + '@mail.com'
            newPassword = 'newPassword-' + Math.random()
        })

        afterEach(async () => {
            return await User.findByIdAndRemove(id)
        })

        it('should fail when there is no token in storage', async () => {
            updates = { email: newEmail, wrongField: name, oldPassword: password, newPassword }
            try {
                await updateUser(updates)
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })


    afterAll(async () => {
        await Promise.resolve(User.deleteMany({}))
        return await mongoose.disconnect()
    })
})