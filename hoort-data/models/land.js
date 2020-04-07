const mongoose = require('mongoose')
const { land } = require('../schemas')

module.exports = mongoose.model('Land', land)