require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { searchItems, createItem } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Item } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')

describe('searchItems', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return Item.deleteMany({})
    })

    let id, colorId, name, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference, query
    let results = []

    beforeEach(async () => {

        type = 'type'
        for (let i = 0; i < 10; i++) {

            colorId = `colorId-${random()}`
            name = `name-${random()}`
            type = `type-${random()}`
            subtype = `subtype-${random()}`
            growth = `growth-${random()}@mail.com`
            growthDuration = `growthDuration-${random()}`
            soil = `soil-${random()}`
            temperature = `temperature-${random()}`
            bestPeriod = `bestPeriod-${random()}`
            bestPeriodNum = [1, 2, 3]
            lightPreference = `lightPreference-${random()}`

            let result = await createItem(colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference)
            results.push(result)
        }
    })

    it('should succeed on correct data', async () => {

        return searchItems('type')
            .then(results => {
                expect(results.length).to.eql(10)
            })
    })

    it('should return no results for no results search', () =>
        //expect(() => {
        searchItems('lalalalalal')
            .then(item => {
                throw new Error('should not reach this point')
            })
            .catch((error) => {
                expect(error.message).to.eql(`There are no results for your search :(`)
            })
        //})
    )

    afterEach(() => {
        Item.deleteOne({ id })
            .then(() => { })
    })

    after(() => mongoose.disconnect())
})