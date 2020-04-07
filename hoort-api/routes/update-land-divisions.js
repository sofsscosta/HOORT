const { updateLandDivisions } = require('../logic')
const { NotFoundError, NotAllowedError } = require('../../hoort-errors')

module.exports = (req, res) => {
    const { body: { operation: operation, land: landId, scheme } } = req

    try {
        updateLandDivisions(operation, landId, scheme)
            .then(land => res.status(201).json(land))
            .catch(error => {
                let status = 400

                let { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {

        let status = 400

        switch (true) {
            case error instanceof NotFoundError:
                status = 401
                break
            case error instanceof NotAllowedError:
                status = 403
        }

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}