// models/foodLogModel.js

const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
})

const foodLogSchema = new mongoose.Schema({
    userId: String,
    date: {
        type: String, // store as YYYY-MM-DD (IMPORTANT)
    },
    foods: [foodSchema]
})

const foodLogs = mongoose.model("foodLogs", foodLogSchema)
module.exports = foodLogs