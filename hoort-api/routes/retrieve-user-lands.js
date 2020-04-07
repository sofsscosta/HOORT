const { retrieveUserLands } = require('../logic')
const { NotFoundError, NotAllowedError } = require('../../hoort-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId } } = req

    try {
        retrieveUserLands(userId)
            .then(lands => res.status(200).json(lands))
            .catch(({ message }) =>
                res
                    .status(401)
                    .json({
                        error: message
                    })
            )
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