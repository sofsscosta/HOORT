const { models: { Item } } = require('hoort-data')

module.exports = async () => {

    let results = []

    let items = await Item.find()

    items.forEach(item => results.push({ id: item.id, name: item.name }))

    return results
}