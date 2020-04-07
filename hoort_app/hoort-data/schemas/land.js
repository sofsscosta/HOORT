const { Schema, Types: { ObjectId } } = require('mongoose')
const Plantation = require('./plantation')

module.exports = new Schema({
    name: { type: String, required: true },
    userId: { type: ObjectId, required: true },
    location : { type: String, required: true }, // geolocation
    soiltype: { type: String, required: true }, //best type of soil to plant in
    retrieved: { type: Date },
    plantation: { type: [Plantation] },
    //array of objectsIds of all veggies that go into the land
    scheme: { type: Array
        , default: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ]
    , required: true
 },
    created: { type: Date } //array with objects representing a line, made of an array of 0's and ids of items
})