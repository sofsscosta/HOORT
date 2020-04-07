const config = require('../config')
const { retrieveItem, createItem } = require('.')
const { mongoose, models: { Item } } = require('../hoort-data')
const { random } = Math

const logic = require('.')
const AsyncStorage = require('not-async-storage')

logic.__context__.MONGODB_URL = config.TEST_MONGODB_URL
logic.__context__.API_URL = config.API_URL
logic.__context__.storage = AsyncStorage

TEST_MONGODB_URL = config.TEST_MONGODB_URL
JWT_SECRET = config.TEST_JWT_SECRET

describe('retrieveItem', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(Item.deleteMany({}))
    })

    let id, colorId, name, type, growth, growthDuration, soil, temperature, bestPeriod, lightPreference, query, item

    beforeEach(async () => {

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

        item = await Item.findOne({ name: name })
        id = item.id
    })

    it('should succeed on valid id', async () => {

        let result = await retrieveItem(id)

        expect(result).toBeDefined()

        expect(result.name).toBe(item.name)
        expect(result.colorId).toBe(item.colorId)
        expect(result.type).toBe(item.type)
        expect(result.growth).toBe(item.growth)
        expect(result.growthDuration).toBe(item.growthDuration)
        expect(result.soil).toBe(item.soil)
        expect(result.temperature).toBe(item.temperature)
        expect(result.bestPeriod).toBe(item.bestPeriod)
        expect(result.lightPreference).toBe(item.lightPreference)
    })

    it('should fail on non-existant id', async () => {

        try {
            await retrieveItem(`wrong-id`)
        } catch (error) {
            expect(error.message).toBe(`There\'s no item corresponding to this id!`)
        }
    })

    afterAll(async () => {
        await Promise.resolve(Item.deleteMany({}))
        return await mongoose.disconnect()
    })
})