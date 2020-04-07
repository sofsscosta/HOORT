const { createLand } = require('../logic')
const { NotAllowedError, ContentError } = require('../../hoort-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId }, body: { name, location, soiltype, scheme } } = req

    try {
        createLand(name, userId, location, soiltype, scheme)
            .then(() => res.status(201).end())
            .catch(error => {
                let status = 400

                if (error instanceof NotAllowedError)
                    status = 409 // conflict

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406 // not acceptable

        message = error.message

        res
            .status(status)
            .json({
                error: message
            })
    }
}