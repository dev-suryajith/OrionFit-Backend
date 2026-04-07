const mongoose = require('mongoose')

const userSchemma = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    height: {
        type: String
    },
    age: {
        type: Number
    },
    weight: {
        type: String
    },
    gender: {
        type: String
    },
    activityLevel: {
        type: String
    },
    water: {
        type: Number
    },
    goal: {
        type: String
    },
    protein: {
        type: String
    },
    carbs: {
        type: String
    },
    fats: {
        type: String
    },
    calorieIntake: {
        type: String
    },
    profile: {
        type: String
    }
})

const users = mongoose.model("users", userSchemma)
module.exports = users