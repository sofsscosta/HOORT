const mongoose = require('mongoose')
const { item } = require('../schemas')

module.exports = mongoose.model('Item', item)