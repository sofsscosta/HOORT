const { Schema, Types: { ObjectId } } = require('mongoose')
const Plantation = require('./plantation')

module.exports = new Schema({
    name: { type: String, required: true },
    userId: { type: ObjectId, required: true },
    location: { type: String, required: true },
    soiltype: { type: String, required: true }, //best type of soil to plant in
    retrieved: { type: Date },
    plantation: { type: [Plantation] },

    scheme: {
        type: Array   //array of objectsIds of all veggies that go into the land and their XY positions
        , default: [
            [
                { id: '01', status: false, veggie: undefined },
                { id: '02', status: false, veggie: undefined },
                { id: '03', status: false, veggie: undefined }
            ],
            [
                { id: '11', status: false, veggie: undefined },
                { id: '12', status: false, veggie: undefined },
                { id: '13', status: false, veggie: undefined }
            ],
            [
                { id: '21', status: false, veggie: undefined },
                { id: '22', status: false, veggie: undefined },
                { id: '23', status: false, veggie: undefined }
            ],
            [
                { id: '31', status: false, veggie: undefined },
                { id: '32', status: false, veggie: undefined },
                { id: '33', status: false, veggie: undefined }
            ],
            [
                { id: '41', status: false, veggie: undefined },
                { id: '42', status: false, veggie: undefined },
                { id: '43', status: false, veggie: undefined }
            ]
        ]
        , required: true
    },
    created: { type: Date }
})