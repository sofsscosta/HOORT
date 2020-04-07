const config = require('../config')
const { searchItems, createItem } = require('.')
const { mongoose, models: { Item, User, Land } } = require('../hoort-data')
const { random } = Math
const jwt = require('jsonwebtoken')

const logic = require('.')
const AsyncStorage = require('not-async-storage')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
logic.__context__.storage = AsyncStorage

TEST_MONGODB_URL = config.TEST_MONGODB_URL
JWT_SECRET = config.TEST_JWT_SECRET

describe('searchItems', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(Item.deleteMany({}))
    })

    let id, colorId, name, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference, query, index
    let results = []

    beforeEach(async () => {

        type = 'type'
        for (let i = 0; i < 10; i++) {

            colorId = `colorId-${random()}`
            name = `name-${random()}`
            type = `type`
            subtype = `subtype-${random()}`
            growth = `growth-${random()}@mail.com`
            growthDuration = `growthDuration-${random()}`
            soil = `soil-${random()}`
            temperature = `temperature-${random()}`
            bestPeriod = `bestPeriod-${random()}`
            bestPeriodNum = [1, 2, 3]
            lightPreference = `lightPreference-${random()}`

            await createItem(colorId, name, type, subtype, growth, growthDuration, soil, temperature, bestPeriod, bestPeriodNum, lightPreference)

            let result = await Item.findOne({ name: name })

            results.push(result)
        }

        index = Math.floor(Math.random() * 10)
    })

    afterEach(async () => {
        results = []
        await Item.deleteMany({})
        return
    })

    it('should succeed on search by item name and have results length of 1', async () => {
        query = results[index].name

        let _results = await searchItems(query)

        expect(_results.length).toBe(1)
        expect(_results[0].name).toBe(results[index].name)
        expect(_results[0].colorId).toBe(results[index].colorId)
        expect(_results[0].type).toBe(results[index].type)
        expect(_results[0].growth).toBe(results[index].growth)
        expect(_results[0].growthDuration).toBe(results[index].growthDuration)
        expect(_results[0].soil).toBe(results[index].soil)
        expect(_results[0].temperature).toBe(results[index].temperature)
        expect(_results[0].bestPeriod).toBe(results[index].bestPeriod)
        expect(_results[0].lightPreference).toBe(results[index].lightPreference)

    })

    it('should succeed on search that matches many items', async () => {

        query = type

        let _results = await searchItems(query)

        expect(_results.length).toBe(10)

        for (let i = 0; i < 10; i++) {
            expect(_results[i].name).toBe(results[i].name)
            expect(_results[i].colorId).toBe(results[i].colorId)
            expect(_results[i].type).toBe(results[i].type)
            expect(_results[i].growth).toBe(results[i].growth)
            expect(_results[i].growthDuration).toBe(results[i].growthDuration)
            expect(_results[i].soil).toBe(results[i].soil)
            expect(_results[i].temperature).toBe(results[i].temperature)
            expect(_results[i].bestPeriod).toBe(results[i].bestPeriod)
            expect(_results[i].lightPreference).toBe(results[i].lightPreference)
        }

    })

    it('should return no results for no results search', () =>
        searchItems('lalalalalal')
            .then(() => {
                throw new Error('should not reach this point')
            })
            .catch((error) => {
                expect(error.message).toBe(`There are no results for your search :(`)
            })
    )

    afterAll(async () => {
        await Promise.resolve(Item.deleteMany({}))
        return await mongoose.disconnect()
    })
})