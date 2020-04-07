const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    colorId: { type: String, required: true },  //cidentification by color for calendar
    name: { type: String, required: true },
    type : { type: String, required: true }, //tuber, fruit, bean...
    subtype: { type: String, required: true },   
    growth: { type: String, required: true },   //if it grows under or over soil
    growthDuration: { type: String, required: true },   // average time it takes to grow the veggie
    //growthDurationUser: { type: Number }, //interval with max number of days and min.
    growthDurationAll: { type: String },
    soil: { type: String, required: true }, //type of soil
    //tips: { type: String, required: true },
    //image: { type: String, required: true },
    temperature: { type: String, required: true },
    bestPeriod: { type: String, required: true },   // best period to plant
    bestPeriodNum: { type: [], required: true },   //to find the month on mongodb
    lightPreference: { type: String, required: true }
    //state: [itemState],
    //planted: { type: { ObjectId: Date } } // ObjectId for user id
})