require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveAllItems, createItem } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Item } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')

describe('retrieveAllItems', () => {

    before(() => {
        return mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Item.deleteMany({})).then(() => { })
    })

    let colorId, nameVeggie, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference
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
    })


    it('should succeed on correct data', () => {

        return Item.insertMany(veggies).then(() => { })
            .then(() => retrieveAllItems())
            .then(results => {
                expect(results.constructor).to.equal(Array)
                expect(results).to.have.length(10)
                expect({ name: veggies[0].name, id: veggies[0].id }).to.eql({ name: results[0].name, id: results[0].id })
                expect({ name: veggies[1].name, id: veggies[1].id }).to.eql({ name: results[1].name, id: results[1].id })
                expect({ name: veggies[2].name, id: veggies[2].id }).to.eql({ name: results[2].name, id: results[2].id })
                expect({ name: veggies[9].name, id: veggies[9].id }).to.eql({ name: results[9].name, id: results[9].id })
            })
    })

    afterEach(() => {
        Item.deleteMany({})
            .then(() => { })
    })

    after(() => mongoose.disconnect())
})