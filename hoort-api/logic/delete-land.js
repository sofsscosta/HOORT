const { validate } = require('hoort-utils')
const { models: { Land, User } } = require('hoort-data')
const { NotAllowedError } = require('../../hoort-errors')
const { SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = (id, landId) => {

    validate.string(id, 'id')
    validate.string(landId, 'landId')

    return Land.findById(landId)
        .then(land => {
            // if (land instanceof Error) throw new NotAllowedError(`This land doesn't exist!`)

            if (land.userId.toString() !== id) throw new NotAllowedError(`This land doesn't belong to this user`)

            return Land.findByIdAndDelete(landId)
        })
        .then(() => User.findByIdAndUpdate(id, { $pull: { lands: landId } }))
        .then(() => { })
}