const context = require('./context')

module.exports = function () {
    return this.storage.removeItem('token')
}.bind(context)
