require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { updateItemAdd, createLand } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Land, Item, User } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const bcrypt = require('bcryptjs')

describe('updateItemAdd', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference,
        userId, user, name, username, email, password,
        nameLand, location, soiltype, scheme, land, landId

    let veggies = []

    beforeEach(() => {

    })

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

                await land.save()
            })
    })

    it('should add veggie to lands\' plantations', async () => {
        for (let i = 0; i < veggies.length; i++) {

            await updateItemAdd(userId, landId, veggies[i].id.toString())

            let _land = await Land.findOne({ plantation: { $elemMatch: { veggie: veggies[i].id.toString() } } })

            let plantation = _land.plantation.find(plant => plant.veggie.toString() === veggies[i].id.toString())

            expect(_land.id).to.eql(landId)
            expect(plantation).to.exist
            expect(plantation.to).to.eql(null)
            expect(plantation.from).to.eql(null)
        }
    })

    it('should not add veggie to land\'s plantation if item is already planted', async () => {
        for (let i = 0; i < veggies.length; i++) {

            await updateItemAdd(userId, landId, veggies[i].id.toString())
            await updateItemAdd(userId, landId, veggies[i].id.toString())

            let _land = await Land.findOne({ plantation: { $elemMatch: { veggie: veggies[i].id.toString() } } })

            let plantation = _land.plantation.filter(plant => plant.veggie.toString() === veggies[i].id.toString())

            expect(_land.id).to.eql(landId)
            expect(plantation).to.have.length(1)
            expect(plantation[0].to).to.eql(null)
            expect(plantation[0].from).to.eql(null)
        }
    })


    it('should fail on not defined veggie', async () => {
        for (let i = 0; i < veggies.length; i++) {

            expect(async () => {
                await updateItemAdd(userId, landId, `${veggies[i].id.toString()}--wrong`)
            }).to.throw
        }
    })


    it('should fail on not defined land', async () => {
        for (let i = 0; i < veggies.length; i++) {

            expect(async () => {
                await updateItemAdd(userId, `${landId}--wrong`, veggies[i].id.toString())
            }).to.throw
        }
    })

    // land.plantation.find(item =>
    //     item.veggie.toString() === itemId
    // ) !== undefined)

    afterEach(async () => {
        await Item.deleteMany({})
        await User.deleteMany({})
        await Land.deleteMany({})
    })

    after(() => mongoose.disconnect())
})