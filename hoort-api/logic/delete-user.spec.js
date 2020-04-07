require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { deleteUser } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { User } } = require('hoort-data')
const expect = chai.expect
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('deleteUser', () => {
    let name, username, email, password, id

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    beforeEach(() => {
        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()

        return bcrypt.hash(password, 10)
            .then(password =>
                User.create({ name, username, email, password })
            )
            .then(user => id = user.id)
    })

    it('should succeed on correct id', () => {

        return deleteUser(id, password)
            .then(() => User.findById(id))
            .then(user => {
                expect(user).to.be.null
            })
    })

    it('should fail on incorrect password', () => {
        password = `${password}--wrong`
        return deleteUser(id, password)
            .then(() => { throw new Error('should not reach this point') })
            .catch(error => {
                expect(error.message).to.eql('wrong credentials')
            })
    })

    it('should fail on incorrect id format', () => {
        id = undefined
        expect(() => {
            return deleteUser(id, password)
        }).to.throw(TypeError, 'id undefined is not a string')
    })

    afterEach(() => {
        User.findByIdAndRemove(id)
    })

    after(() => {
        mongoose.disconnect()
    })

})