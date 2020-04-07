const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    created: { type: Date, required: true, default: Date.now },
    authenticated: { type: Date },
    retrieved: { type: Date },
    lands: { type: [ObjectId], ref: 'Land' },
    //veggies: { type: [ObjectId], ref: 'Item' }
})