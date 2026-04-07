const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    duration: {
        type: Number
    },
    exercises: [
        {
            name: {
                type: String
            },
            sets: [
                {
                    reps: {
                        type: Number
                    },
                    weight: {
                        type: Number
                    }
                }
            ]
        }
    ]
}, { timestamps: true })

const workouts = mongoose.model("workouts", workoutSchema)
module.exports = workouts