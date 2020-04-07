require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { Item } } = require('hoort-data')
//const { SchemaTypes: { ObjectId } } = require('mongoose')
const { expect } = require('chai')
const { random } = Math
const createItem = require('./create-item')
const { mongoose } = require('hoort-data')

describe('createItem', () => {
    before(() => mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }))

    let id, colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference

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
        bestPeriodNum = [0, 2, 6]
        lightPreference = `lightPreference-${random()}`
    })

    it('should succeed on valid data', () => {

        return createItem(colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference)
            .then(() => Item.findOne({ name }))
            .then(item => {
                expect(item).to.exist
                id = item.id
                expect(item.name).to.equal(name)
                expect(item.type).to.equal(type)
                expect(item.subtype).to.equal(subtype)
                expect(item.growth).to.equal(growth)
                expect(item.soil).to.equal(soil)
                expect(item.temperature).to.equal(temperature)
                expect(item.bestPeriod).to.equal(bestPeriod)
                expect(item.bestPeriodNum).to.deep.equal(bestPeriodNum)
                expect(item.lightPreference).to.equal(lightPreference)
            })
    })

    it('should fail on not all fields defined', () => {
        expect(() => {
            return createItem(colorId, name, type, subtype, growthDuration, soil, temperature)
        }).to.throw(TypeError, 'temperature undefined is not a string')
    })

    it('should fail on repeated name', () => {

        return createItem(colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference)
            .then(() => createItem(colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference))
            .then(() => { throw new Error('should not reach this point') })
            .catch(error => {
                expect(error).to.exist
                expect(error.message).to.eql(`item with name ${name} already exists`)
            })
    })

    afterEach(() => {
        Item.findByIdAndRemove({ id })
    })

    after(() => mongoose.disconnect())
})