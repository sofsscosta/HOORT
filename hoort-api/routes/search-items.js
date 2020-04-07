const { searchItems } = require('../logic')
const { NotFoundError, NotAllowedError } = require('../../hoort-errors')

module.exports = (req, res) => {
    const { params: { query } } = req

    try {
        searchItems(query)
            .then(results => {

                res.status(200).json(results)
            })
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