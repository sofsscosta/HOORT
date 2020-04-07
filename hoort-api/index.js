require('dotenv').config()

const { env: { PORT = 8080, NODE_ENV: env, MONGODB_URL }, argv: [, , port = PORT] } = process

const express = require('express')
const winston = require('winston')

const { registerUser, authenticateUser, retrieveUser, updateUser, deleteUser, createItem,
    retrieveItem, searchItems, createLand, retrieveLand, deleteLand, searchReccommended,
    updateLandDivisions, updateLandPlanted, updateItem, updateItemPlanted, updateItemHarvested,
    retrieveUserVeggies, retrieveLandPlantations, retrieveItemForUser, retrieveUserLands,
    deleteVeggieFromLand, retrieveInterval, retrieveAllItems, updateItemAdd,
    retrieveUserPlantations } = require('./routes')

const { name, version } = require('./package')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const { jwtVerifierMidWare } = require('./mid-wares')
const { mongoose } = require('hoort-data')
const cors = require('cors')


mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        const logger = winston.createLogger({
            level: env === 'development' ? 'debug' : 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: 'server.log' })
            ]
        })

        if (env !== 'production') {
            logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }))
        }

        const jsonBodyParser = bodyParser.json()

        const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

        const app = express()

        app.use(cors())

        app.use(morgan('combined', { stream: accessLogStream }))

        app.post('/users', jsonBodyParser, registerUser)

        app.post('/users/auth', jsonBodyParser, authenticateUser)

        app.get('/users', [jwtVerifierMidWare, jsonBodyParser], retrieveUser)

        app.patch('/users', [jwtVerifierMidWare, jsonBodyParser], updateUser)

        app.delete('/users/delete', [jwtVerifierMidWare, jsonBodyParser], deleteUser)

        app.post('/items', jsonBodyParser, createItem)

        app.patch('/item/add', [jwtVerifierMidWare, jsonBodyParser], updateItemAdd)

        app.patch('/item/planted', [jwtVerifierMidWare, jsonBodyParser], updateItemPlanted)

        app.patch('/item/harvested', [jwtVerifierMidWare, jsonBodyParser], updateItemHarvested)

        app.patch('/item', [jwtVerifierMidWare, jsonBodyParser], updateItem)

        app.delete('/item/delete', [jwtVerifierMidWare, jsonBodyParser], deleteVeggieFromLand)

        app.get('/item/:itemId', jsonBodyParser, retrieveItem)

        app.get('/allitems/:query', jsonBodyParser, searchItems)

        app.get('/items/all', jsonBodyParser, retrieveAllItems)

        app.get('/items', [jwtVerifierMidWare, jsonBodyParser], retrieveUserVeggies)

        app.get('/item/user/:itemId', [jwtVerifierMidWare, jsonBodyParser], retrieveItemForUser)

        app.post('/land', [jwtVerifierMidWare, jsonBodyParser], createLand)

        app.get('/land/user', [jwtVerifierMidWare, jsonBodyParser], retrieveUserLands)

        app.get('/land/plantations', [jwtVerifierMidWare, jsonBodyParser], retrieveUserPlantations)

        app.get('/land/planted/:landId', [jwtVerifierMidWare, jsonBodyParser], retrieveLandPlantations)

        app.get('/calendar', [jwtVerifierMidWare, jsonBodyParser], retrieveInterval)

        app.patch('/land/divisions', jsonBodyParser, updateLandDivisions)

        app.patch('/land/planted', [jwtVerifierMidWare, jsonBodyParser], updateLandPlanted)

        app.delete('/land', [jwtVerifierMidWare, jsonBodyParser], deleteLand)

        app.get('/land/:landId', [jwtVerifierMidWare, jsonBodyParser], retrieveLand)

        app.get('/items/reccommended', searchReccommended)

        app.listen(port, () => logger.info(`server ${name} ${version} up and running on port ${port}`))

        process.on('SIGINT', () => {
            logger.info('server abruptly stopped')

            process.exit(0)
        })
    })