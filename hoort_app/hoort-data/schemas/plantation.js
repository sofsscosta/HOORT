const { Schema, Types: { ObjectId } } = require('mongoose')
const moment = require('moment')

module.exports = new Schema({
    veggie: { type: ObjectId, ref: 'Item' }, 
    to: { type: Date, default: null }, 
    from: { type: Date, default: null },
    estTime: { type: String } 
    //userTime: { type: Number }, // average number of days that took user to harvest. Only when state === 'harvested'
    //state: { type: String, enum: ['planted', 'not planted', 'harvested'], default: 'not planted' },
})

// veggies: { type: 
//     [
//         {  
//             _id: { type: ObjectId, ref: 'Item' }, 
//             estTime: { type: String }, 
//             userTime: { type: Number }, // average number of days that took user to harvest. Only when state === 'harvested'
//             state: { type: String, enum: ['planted', 'not planted', 'harvested'], default: 'not planted' },
//             planted: { type: Date } 
//         }
//     ]
// }, 