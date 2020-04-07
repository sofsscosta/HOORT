const mongoose = require('mongoose')
const { plantation } = require('../schemas')

module.exports = mongoose.model('Plantation', plantation)