const mongoose = require('mongoose')

const waterLogSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    logs: [
        {
            amount: Number,
            time: {
                type: Date,
                default: Date.now
            }
        }
    ]
})
const waterLogs = mongoose.model("waterLogs", waterLogSchema)
module.exports = waterLogs