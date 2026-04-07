const mongoose = require('mongoose')

const foodLogSchema = new mongoose.Schema({
    userId: String,
    date: {
        type: Date,
        default: Date.now
    },
    foods: [
        {
            name: String,
            quantity: Number,

            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number
        }
    ]
})
const foodLogs = mongoose.model("foodLogs", foodLogSchema)
module.exports = foodLogs