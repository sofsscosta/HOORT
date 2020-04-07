require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { retrieveItem, createItem } = require('.')
const chai = require('chai')
const { mongoose } = require('hoort-data')
const { models: { Item } } = require('hoort-data')
const expect = chai.expect
const { random } = Math
const { NotFoundError, NotAllowedError } = require('hoort-errors')

describe('retrieveItem', () => {

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    let id, colorId, name, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference

    beforeEach(() => {
        colorId = `colorId-${random()}`
        name = `name-${random()}`
        type = `type-${random()}`
        subtype = `subtype-${random()}`
        growth = `growth-${random()}@mail.com`
        growthDuration = `growthDuration-${random()}`
        soil = `soil-${random()}`
        temperature = `temperature-${random()}`
        bestPeriod = `bestPeriod-${random()}`
        bestPeriodNum = [0, 9, 8]
        lightPreference = `lightPreference-${random()}`

        return createItem(colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference)
            .then(() => Item.findOne({ name }))
            .then(item => id = item.id)
    })

    it('should succeed on correct data', () =>
        retrieveItem(id)
            .then(item => {
                expect(item.constructor).to.equal(Object)
                expect(item.colorId).to.equal(colorId)
            })
    )

    it('should fail on invalid id', () =>
        expect(() => {
            retrieveItem(`${id}--wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch((error) => {
                    expect(error).to.eql(NotFoundError, `There\'s no item corresponding to this id!`)
                })
        })
    )

    afterEach(() => {
        Item.deleteOne({ id })
            .then(() => { })
    })

    after(() => mongoose.disconnect())
})