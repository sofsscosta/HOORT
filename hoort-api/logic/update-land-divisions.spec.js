const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Land } } = require('hoort-data')
const { expect } = require('chai')
const { random } = Math
const { updateLandDivisions, createLand } = require('./')
const { NotAllowedError } = require('hoort-errors')
const { mongoose } = require('hoort-data')

describe('updateLandDivisions', () => {

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany({})
        await Land.deleteMany({})
        return
    })

    let id, veggiesId, name, userId, location, soiltype, scheme, nameUser, username, email, password,
        user, land, landId, landId2

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
            /*if (arr === 0) */for (let j = 0; j < 3; j++) arr.push(false)

            // else for (let j = 0; j < 3; j++)
            //     arr.push(veggiesId[j])
        }

        return User.create({ name: nameUser, username, email, password })
            .then(_user => {
                user = _user
                userId = _user.id
            })
            .then(() => createLand(name, userId, location, soiltype, scheme))
            .then(() => Land.findOne({ name }))
            .then(land => landId = land.id)
            .then(() => createLand(`${name}--2`, userId, location, soiltype, scheme))
            .then(() => Land.findOne({ name: `${name}--2` }))
            .then(land => landId2 = land.id)
    })

    it('should double the number of rows and columns on add', async () => {

        await updateLandDivisions('+', landId)

        land = await Land.findById(landId)

        expect(land.scheme).to.have.length(10)

        for (let line of land.scheme) {
            expect(line).to.have.length(6)
        }


        await updateLandDivisions('+', landId)

        land = await Land.findById(landId)

        expect(land.scheme).to.have.length(20)

        for (let line of land.scheme) {
            expect(line).to.have.length(12)
        }



        let newScheme = await updateLandDivisions('+', undefined, scheme)

        expect(newScheme).to.have.length(10)

        for (let line of newScheme) {
            expect(line).to.have.length(6)
        }

        newScheme = await updateLandDivisions('+', undefined, scheme)

        expect(newScheme).to.have.length(20)

        // for (let line of newScheme) {
        //     expect(line).to.have.length(12)
        // }
    })

    it('should cut in half the number of rows and columns on subtract', async () => {

        await updateLandDivisions('+', landId)

        await updateLandDivisions('-', landId)

        land = await Land.findById(landId)

        expect(land.scheme).to.have.length(5)

        for (let line of land.scheme) {
            expect(line).to.have.length(3)
        }


        await updateLandDivisions('+', undefined, scheme)

        let smallScheme = await updateLandDivisions('-', undefined, scheme)

        expect(smallScheme).to.have.length(5)

        for (let line of smallScheme) {
            expect(line).to.have.length(3)
        }

    })

    it('should fail on max divisions', async () => {
        try {
            await updateLandDivisions('+', landId)
            await updateLandDivisions('+', landId)
            await updateLandDivisions('+', landId)

        } catch (error) {
            expect(error.message).to.eql('Max limit of divisions')
        }
    })

    it('should fail on min divisions', async () => {

        try {
            await updateLandDivisions('-', landId)

        } catch (error) {
            expect(error.message).to.eql('Min limit of divisions')
        }
    })

    it('should fail on no scheme passed', async () => {

        try {
            await updateLandDivisions('-', undefined)

        } catch (error) {
            expect(error.message).to.eql('land id or scheme must be introduced')
        }
    })

    afterEach(async () => {
        await User.deleteMany({})
        await Land.deleteMany({})
        return
    })

    after(() => mongoose.disconnect())
})