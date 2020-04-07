const { validate } = require('hoort-utils')
const { models: { Land } } = require('hoort-data')
const { NotAllowedError, ContentError } = require('../../hoort-errors')
const { SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = async (operation, landId, scheme) => {
    validate.string(operation, 'operation')
    if (landId) validate.string(landId, 'landId')

    if (!landId && !scheme) throw new Error('land id or scheme must be introduced')
    if (operation === '+') {

        if (landId) {

            let land = await Land.findById(landId)
            if (!land) throw new Error(`land with id ${landId} doesn't exist`)

            if (land.scheme.length <= 19) {

                let _scheme = land.scheme
                let newLine = new Array

                for (let i = 0; i < _scheme[0].length; i++) newLine.push(false)

                let count = _scheme.length

                for (let i = 0; i < count; i++) _scheme.push(newLine)

                count = _scheme.length / 2 + 1

                let count2 = _scheme[0].length

                for (let j = 0; j < count; j++) {
                    for (let k = 0; k < count2; k++)
                        _scheme[j].push(false)
                }

                land.scheme = _scheme

                return await land.save()
            }

            else throw new NotAllowedError('Max limit of divisions')
        }

        if (scheme) {

            if (scheme.length <= 19) {

                let _scheme = scheme
                let newLine = new Array

                for (let i = 0; i < _scheme[0].length; i++) newLine.push(false)

                let count = _scheme.length

                for (let i = 0; i < count; i++) _scheme.push(newLine)

                count = _scheme.length / 2 + 1

                let count2 = _scheme[0].length

                for (let j = 0; j < count; j++) {
                    for (let k = 0; k < count2; k++)
                        _scheme[j].push(false)
                }

                return _scheme
            }

            else throw new NotAllowedError('Max limit of divisions')
        }

        else throw new Error('land id or scheme must be introduced')
    }

    else if (operation === '-') {

        if (landId) {

            let land = await Land.findById(landId)
            if (!land) throw new Error(`land with id ${landId} doesn't exist`)

            if (land.scheme.length >= 7) {

                let scheme = land.scheme

                let count = scheme.length / 2

                for (let i = 0; i < count; i++) scheme.pop()

                count = scheme[0].length / 2

                for (let j = 0; j < scheme.length; j++) {
                    for (let k = 0; k < count; k++)
                        scheme[j].pop()
                }

                land.scheme = scheme

                return await land.save()
            }

            else throw new NotAllowedError('Min limit of divisions')
        }

        if (scheme) {
            if (scheme.length >= 7) {

                let _scheme = scheme

                let count = _scheme.length / 2

                for (let i = 0; i < count; i++) _scheme.pop()

                count = _scheme[0].length / 2

                for (let j = 0; j < _scheme.length; j++) {
                    for (let k = 0; k < count; k++)
                        _scheme[j].pop()
                }

                return _scheme
            }

            else throw new NotAllowedError('Min limit of divisions')
        }
    }

    else throw new Error('land id or scheme must be introduced')
}