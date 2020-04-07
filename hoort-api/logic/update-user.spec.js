require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { updateUser } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { User } } = require('hoort-data')
const expect = chai.expect
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('updateUser', () => {
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

    it('should succeed on correct data and all possible fields passed', () => {
        let name1, username1, email1, password1

        name1 = 'name-' + Math.random()
        username1 = 'username-' + Math.random()
        email1 = Math.random() + '@mail.com'
        password1 = 'password-' + Math.random()

        return updateUser(id, { name: name1, username: username1, email: email1, oldPassword: password, newPassword: password1 })
            .then(() => User.findById(id))
            .then(user => {
                expect(user.name).to.eql(name1)
                expect(user.username).to.eql(username1)
                expect(user.email).to.eql(email1)

                return bcrypt.compare(password1, user.password)
                    .then(isValid => {
                        expect(isValid).to.be.true
                    })
            })
    })

    it('should succeed if some fields are passed', () => {
        let username1, password1

        username1 = 'username-' + Math.random()
        password1 = 'password-' + Math.random()

        return updateUser(id, { username: username1, oldPassword: password, newPassword: password1 })
            .then(() => User.findById(id))
            .then(user => {
                expect(user.name).to.eql(name)
                expect(user.username).to.eql(username1)
                expect(user.email).to.eql(email)

                return bcrypt.compare(password1, user.password)
                    .then(isValid => {
                        expect(isValid).to.be.true
                    })
            })
    })

    it('should fail if invalid fields are passed', () => {

        let wrongField = 'wrong-field-' + Math.random()

        return updateUser(id, { wrongField })
            .then(() => { throw new Error('should not reach this point') })
            .catch(error => {
                expect(error.message).to.eql(`invalid field wrongField`)
            })
    })

    describe('on password change', () => {

        let username1, password1

        username1 = 'username-' + Math.random()
        password1 = 'password-' + Math.random()

        it('should fail if user doesn\'t introduce old password', () => {
            return updateUser(id, { username: username1, newPassword: password1 })
                .then(() => User.findById(id))
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.eql('Please insert your old password')
                })
        })

        it('should fail if user doesn\'t introduce new password', () => {
            return updateUser(id, { username: username1, oldPassword: password1 })
                .then(() => User.findById(id))
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.eql('Please insert your new password')
                })
        })
    })



    it('should fail if a field is empty', () => {
        let username1, password1

        username1 = ''
        password1 = 'password-' + Math.random()

        return updateUser(id, { username: username1, password: password1 })
            .then(() => { throw new Error('should not reach this point') })
            .catch(error => {
                expect(error.message).to.eql(`field username is empty`)
            })
    })

    afterEach(() => {
        User.findByIdAndRemove(id)
    })

    after(() => {
        mongoose.disconnect()
    })

})