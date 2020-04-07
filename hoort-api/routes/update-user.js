const { updateUser } = require('../logic')
const { NotFoundError, NotAllowedError } = require('../../hoort-errors')

module.exports = (req, res) => {
    const { payload: { sub: id }, body: { updates } } = req

    try {
        updateUser(id, updates)
            .then(() => res.status(201).end())
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