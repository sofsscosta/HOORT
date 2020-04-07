require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User } } = require('hoort-data')
const { expect } = require('chai')
const { random } = Math
const { NotAllowedError } = require('hoort-errors')
const { registerUser } = require('.')
const { mongoose } = require('hoort-data')
const bcrypt = require('bcryptjs')

describe('registerUser', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let name, username, email, password, id

    beforeEach(() => {
        name = 'name-' + random()
        username = 'username-' + random()
        email = random() + '@mail.com'
        password = 'password-' + random()
    })


    it('should succeed on new user', () => {

        return registerUser(name, username, email, password)
            .then(response => {
                expect(response).to.be.an('undefined')
            })
            .then(() => User.findOne({ email }))
            .then((user) => {
                expect(user.name).to.equal(name)
                expect(user.username).to.equal(username)
                expect(user.email).to.equal(email)

                return bcrypt.compare(password, user.password)
            })
            .then(validPassword => expect(validPassword).to.be.true)
    })

    it('should fail on already existing user', () => {
        expect(() =>
            registerUser(name, username, email, password)
                .then(error => {
                    expect(error.message).to.eq(`user with email "${email}" already exists`)
                })
        )
    })

    it('should fail on invalid parameters', () => {
        expect(() =>
            registerUser(true, username, email, password)
                .then(error => {
                    expect(error).to.exist
                })
        )
        expect(() =>
            registerUser(name, true, email, password)
                .then(error => {
                    expect(error).to.exist
                })
        )
        expect(() =>
            registerUser(name, username, true, password)
                .then(error => {
                    expect(error).to.exist
                })
        )
        expect(() =>
            registerUser(name, username, email, true)
                .then(error => {
                    expect(error).to.exist
                })
        )
    })


    afterEach(() => {
        User.deleteOne({ _id: id })
    })

    after(() => {
        mongoose.disconnect()
    })
})