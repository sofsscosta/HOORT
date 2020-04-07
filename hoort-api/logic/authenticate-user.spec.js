require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose } = require('hoort-data')
const { expect } = require('chai')
const { random } = Math
const authenticateUser = require('./authenticate-user')
const { models: { User } } = require('hoort-data')
const { NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('authenticateUser', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let name, username, email, password

    beforeEach(() => {
        name = 'name-' + random()
        username = 'username-' + random()
        email = random() + '@mail.com'
        password = 'password-' + random()
    })

    describe('when user already exists', () => {

        let _id

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, username, email, password })
                )
                .then(user => _id = user.id)
        )

        it('should succeed on correct credentials', () =>
            authenticateUser(email, password)
                .then(id => {
                    expect(id).to.be.a('string')
                    expect(id.length).to.be.greaterThan(0)
                    expect(id).to.equal(_id)
                })
        )

        it('should fail on incorrect password', () => {
            authenticateUser(email, `${password}-wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch(error => expect(error).to.eql(NotAllowedError, `wrong credentials`))
        })

        afterEach(() => {
            User.deleteOne({ _id: _id })
        })
    })

    it('should fail when user does not exist', () => {

        email = '11111@mail.com'
        //expect(() => {
        authenticateUser(email, password)
            .then(() => { throw new Error('should not reach this point') })
            .catch(error => expect(error).to.eql(Error, `wrong credentials`))
        //}).to.throw(Error, 'wrong credentials')
    })

    it('should fail on non-string email', () => {
        email = 1
        expect(() =>
            authenticateUser(email, password)
        ).to.throw(TypeError, `email ${email} is not a string`)

        email = true
        expect(() =>
            authenticateUser(email, password)
        ).to.throw(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() =>
            authenticateUser(email, password)
        ).to.throw(TypeError, `email ${email} is not a string`)
    })

    it('should fail on non-string password', () => {
        email = random() + '@mail.com'
        password = 1
        expect(() =>
            authenticateUser(email, password)
        ).to.throw(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            authenticateUser(email, password)
        ).to.throw(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            authenticateUser(email, password)
        ).to.throw(TypeError, `password ${password} is not a string`)
    })

    after(() =>
        mongoose.disconnect()
    )
})




// .then(() => {throw new Error('should not have reached this point')})
//                 .catch(error => {
//                     expect(error).to.be.instance.of(Error)
//                     expect(error.status).to.equal(409)
//                 })