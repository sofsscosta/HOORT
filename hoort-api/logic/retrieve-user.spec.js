require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveUser } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { User } } = require('hoort-data')
const expect = chai.expect
const { NotFoundError, NotAllowedError } = require('hoort-errors')

describe('retrieveUser', () => {
    let name, username, email, password

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    beforeEach(() => {
        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(() =>
            User.create({ name, username, email, password })
                .then(({ id }) => _id = id)
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveUser(_id)
                .then(user => {
                    expect(user.constructor).to.equal(Object)
                    expect(user.name).to.equal(name)
                    expect(user.username).to.equal(username)
                    expect(user.email).to.equal(email)
                })
        )

        it('should fail on invalid id', () =>
            expect(() => {
                retrieveUser(`${_id}--wrong`)
                    .then(() => { throw new Error('should not reach this point') })
                    .catch((error) => {
                        expect(error).to.eql(NotFoundError, `user with id ${id} does not exist`)
                    })
            })
        )

        afterEach(() => {
            User.deleteOne({ _id })
                .then(() => { })
        })
    })

    it('should fail on invalid id format', () => {
        id = 1
        expect(() =>
            retrieveUser(id)
        ).to.throw(TypeError, `id ${id} is not a string`)

        id = true
        expect(() =>
            retrieveUser(id)
        ).to.throw(TypeError, `id ${id} is not a string`)

        id = undefined
        expect(() =>
            retrieveUser(id)
        ).to.throw(TypeError, `id ${id} is not a string`)
    })

    after(() => mongoose.disconnect())
})