require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { deleteVeggieFromLand, createLand, updateItemAdd } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Land, Item, User } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')
const bcrypt = require('bcryptjs')

describe('deleteVeggieFromLand', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
        userId, user, name, username, email, password,
        nameLand, location, soiltype, scheme, land, landId

    let veggies = []

    beforeEach(async () => {

        type = 'type'
        for (let i = 0; i < 10; i++) {

            colorId = `colorId-${random()}`
            nameVeggie = `name-${random()}`
            type = `type-${random()}`
            subtype = `subtype-${random()}`
            growth = `growth-${random()}@mail.com`
            growthDuration = `growthDuration-${random()}`
            soil = `soil-${random()}`
            temperature = `temperature-${random()}`
            bestPeriod = `bestPeriod-${random()}`
            bestPeriodNum = [1, 2, 3]
            lightPreference = `lightPreference-${random()}`

            let veggie = new Item({ colorId, name: nameVeggie, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference })
            veggies.push(veggie)

        }
        await Item.insertMany(veggies)

        name = 'name-' + Math.random()
        username = 'username-' + Math.random()
        email = Math.random() + '@mail.com'
        password = 'password-' + Math.random()

        return bcrypt.hash(password, 10)
            .then(password =>
                User.create({ name, username, email, password })
            )
            .then(async _user => {
                userId = _user.id
                user = _user
            })
            .then(async () => {

                nameLand = `nameLand-${random()}`
                location = `location-${random()}`
                soiltype = `soiltype-${random()}`
                scheme = [[], [], [], [], []]

                for (let j = 0; j < scheme.length; j++)
                    for (let i = 0; i < 3; i++) {
                        scheme[j].push(veggies[i].id)
                    }

                await createLand(nameLand, userId, location, soiltype, scheme)

                land = await Land.findOne({ name: nameLand })
                landId = land.id

                for (let i = 0; i < 3; i++) {
                    land.plantation.push({ veggie: veggies[i].id })
                }

                await land.save
            })
    })

    it('should delete veggie from provided land id when veggies is on plantation', async () => {
        await updateItemAdd(userId, landId, veggies[0].id.toString())
        await deleteVeggieFromLand(userId, landId, veggies[0].id.toString())
        expect(await Land.findOne({ plantation: { $elemMatch: { veggie: veggies[0].id.toString() } } })).to.eql(null)
    })

    it('should fail if veggie is not on land', async () => {

        try {
            await deleteVeggieFromLand(userId, landId, veggies[0].id.toString())
        } catch (error) {
            expect(error.message).to.eql('this veggie is neither on this land nor on this land\'s plantation')
        }
    })

    it('should fail on invalid land id', async () => {
        try {
            await deleteVeggieFromLand(userId, `${landId}--wrong`, veggies[0].id.toString())
        }
        catch (error) {
            expect(error).to.exist
        }
    })

    it('should fail on invalid veggie id', async () => {
        try {
            await deleteVeggieFromLand(userId, landId, `${veggies[0].id.toString()}--wrong`)
        }
        catch (error) {
            expect(error).to.exist
            expect(error.message).to.eql('this veggie is neither on this land nor on this land\'s plantation')
        }
    })

    it('should fail on invalid user id', async () => {
        try {
            await deleteVeggieFromLand(`${userId}--wrong}`, landId, veggies[0].id.toString())
        }
        catch (error) {
            expect(error).to.exist
        }
    })

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})