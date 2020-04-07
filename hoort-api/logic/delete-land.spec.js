require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { deleteLand, createLand } = require('.')
const chai = require('chai')
const { random } = Math
const { mongoose } = require('hoort-data')
const { models: { User, Land } } = require('hoort-data')
const expect = chai.expect
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('deleteLand', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let userId, otherUserId, landId, veggiesId, name, location, soiltype, scheme, nameUser, username, email, password

    beforeEach(() => {
        nameUser = `nameUser-${random()}`
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`

        name = `name-${random()}`
        location = `location-${random()}`
        soiltype = `soiltype-${random()}`

        veggiesId = []

        for (let i = 0; i < 10; i++)
            veggiesId.push(`veggies-${random()}`)

        scheme = [[], [], [], [], []]

        for (let arr of scheme) {
            if (arr === 0) for (let j = 0; j < 3; j++) arr.push(false)

            else for (let j = 0; j < 3; j++)
                arr.push(veggiesId[j])
        }

        return User.create({ name: nameUser, username, email, password })
            .then(user => userId = user.id)
            .then(() => createLand(name, userId, location, soiltype))
            .then(() => Land.findOne({ name, userId, location, soiltype }))
            .then(land => landId = land.id)

    })

    it('should succeed on correct id', () => {

        return deleteLand(userId, landId)
            .then(() => Land.findById(landId))
            .then(land => expect(land).to.be.null)
    })

    it('should delete land from user\'s lands', () => {
        return deleteLand(userId, landId)
            .then(() => User.findById(userId))
            .then(user => expect(user.lands).not.to.include(landId))
    })

    it('should fail on invalid user id format', () => {
        expect(() => deleteLand(true, landId)
        ).to.throw(TypeError, 'true is not a string')
    })

    it('should fail on invalid land id format', () => {
        expect(() => deleteLand(userId, { landId })
        ).to.throw(TypeError, 'landId [object Object] is not a string')
    })

    afterEach(() => {
        Land.findByIdAndRemove(landId)
        User.findByIdAndRemove(userId)
    })

    after(() => {
        mongoose.disconnect()
    })

})