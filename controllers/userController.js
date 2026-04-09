var jwt = require('jsonwebtoken')
const axios = require("axios")
const users = require('../models/userModel');
const workouts = require('../models/workoutLogModel');
const waterLogs = require('../models/waterLogModel');
const commonFoods = require('../utils/commonFoods');
const foodLogs = require('../models/foodLogModel');

exports.registerUser = async (req, res) => {
    console.log('---- register controller called ----');

    const { username, phone, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(404).json(`This email has already been registered`)
        } else {
            const newUsers = new users({ username, phone, email, password })
            await newUsers.save()
            res.status(200).json(newUsers)
        }
    } catch (error) {
        res.status(500).json(`Error registering user : ${error}`)
    }
}

exports.loginUser = async (req, res) => {
    console.log('---- login controller called ----');

    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        } else {

            if (existingUser.password == password) {
                var token = jwt.sign({ email: existingUser.email }, process.env.JWT_SecretKey);
                res.status(200).json({ existingUser, token })
            } else {
                res.status(405).json({ message: `Incorrect Password` })

            }
        }
    } catch (error) {
        res.status(500).json({ message: `Error logging in : ${error}` })
    }
}

exports.gatherUserData = async (req, res) => {
    console.log('---- gatherUserData controller called ----');

    const { gender, age, height, weight, activityLevel, goal, calorieIntake } = req.body
    const email = req.payload
    console.log(email);

    try {
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        } else {
            const updatedUser = await users.findOneAndUpdate({ email }, { gender, age, height, weight, activityLevel, goal, calorieIntake }, { new: true })
            res.status(200).json(updatedUser)
        }
    } catch (error) {
        res.status(500).json({ message: `Error logging in : ${error}` })
    }
}

exports.logUserWorkout = async (req, res) => {
    console.log('---- logUserWorkout controller called ----')

    const { name, duration, exercises } = req.body
    const email = req.payload

    try {
        if (!name || !duration || !exercises || exercises.length === 0) {
            return res.status(400).json({ message: "Invalid workout data" })
        }
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const newWorkout = new workouts({
            userId: existingUser._id,
            name,
            duration,
            exercises
        })
        await newWorkout.save()
        res.status(201).json(newWorkout)

    } catch (error) {
        res.status(500).json({ message: `Error logging workout: ${error.message}` })
    }
}

exports.fetchWorkoutLog = async (req, res) => {
    console.log('---- fetchWorkoutLog controller called ----')

    const email = req.payload

    try {
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const workoutLog = await workouts.find({ userId: existingUser._id })
        console.log(workoutLog);

        res.status(200).json(workoutLog)

    } catch (error) {
        res.status(500).json({ message: `Error logging workout: ${error.message}` })
    }
}

exports.setWaterIntake = async (req, res) => {
    console.log('---- setWaterIntake controller called ----')

    const { water } = req.body
    const email = req.payload

    try {
        if (!water) {
            return res.status(400).json({ message: "Invalid water data" })
        }
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const updatedUser = await users.findOneAndUpdate({ email }, { water }, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: `Error logging workout: ${error.message}` })
    }
}

exports.logWater = async (req, res) => {
    console.log('---- logWater controller called ----')

    const { amount } = req.body
    const email = req.payload

    // Keep date as start of the day (important)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
        if (!amount) {
            return res.status(400).json({ message: "Invalid water data" })
        }

        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const existingWaterLog = await waterLogs.findOne({
            userId: existingUser._id,
            date: today
        })

        if (!existingWaterLog) {
            // ✅ Create new log with first entry
            const newWaterLog = new waterLogs({
                userId: existingUser._id,
                date: today,
                logs: [
                    {
                        amount,
                        time: new Date()
                    }
                ]
            })

            await newWaterLog.save()
            return res.status(201).json(newWaterLog)

        } else {
            const updatedLog = await waterLogs.findOneAndUpdate(
                {
                    userId: existingUser._id,
                    date: today
                },
                {
                    $push: {
                        logs: {
                            amount,
                            time: new Date()
                        }
                    }
                },
                { new: true }
            )

            return res.status(200).json(updatedLog)
        }

    } catch (error) {
        res.status(500).json({ message: `Error logging water: ${error.message}` })
    }
}

exports.getWaterLog = async (req, res) => {
    console.log('---- logWater controller called ----')
    const today = new Date().setHours(0, 0, 0, 0)

    const email = req.payload
    try {
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const existingWaterLog = await waterLogs.find({ userId: existingUser._id, date: today })
        if (existingWaterLog) {
            return res.status(200).json(existingWaterLog)
        }
    } catch (error) {

    }
}

exports.searchFood = async (req, res) => {
    try {
        const { q } = req.body

        const response = await axios.get(
            `https://api.edamam.com/api/food-database/v2/parser`,
            {
                params: {
                    ingr: q,
                    app_id: process.env.EDAMAM_APP_ID,
                    app_key: process.env.EDAMAM_APP_KEY
                }
            }
        )

        const foods = response.data.hints.map(item => {
            const food = item.food
            const nutrients = food.nutrients

            return {
                name: food.label,

                // ✅ Already per 100g usually
                calories: nutrients.ENERC_KCAL || 0,
                protein: nutrients.PROCNT || 0,
                carbs: nutrients.CHOCDF || 0,
                fat: nutrients.FAT || 0
            }
        })

        res.status(200).json(foods.slice(0, 10))

    } catch (err) {
        console.log(err)
        res.status(500).json("Error fetching food data")
    }
}

exports.logFood = async (req, res) => {
    try {
        const { userId, food } = req.body

        if (!userId || !food) {
            return res.status(400).json("Missing required data")
        }

        // ✅ sanitize & normalize
        const cleanFood = {
            name: food.name || "Unknown Food",
            quantity: Number(food.quantity) || 1,
            calories: Number(food.calories) || 0,
            protein: Number(food.protein) || 0,
            carbs: Number(food.carbs) || 0,
            fat: Number(food.fat) || 0
        }

        const today = new Date().toISOString().split('T')[0]

        let log = await foodLogs.findOne({ userId, date: today })

        if (!log) {
            log = new foodLogs({
                userId,
                date: today,
                foods: [cleanFood]
            })
        } else {
            log.foods.push(cleanFood)
        }

        await log.save()

        res.status(200).json({
            message: "Food logged successfully",
            foods: log.foods
        })

    } catch (err) {
        console.log(err)
        res.status(500).json("Error saving food log")
    }
}

exports.getFoodLog = async (req, res) => {
    const { userId } = req.params
    console.log(userId);
    
    const today = new Date().toISOString().split('T')[0]

    try {
        const log = await foodLogs.find({ userId, date: today })
        console.log(log);
        
        return res.status(200).json(log)

    } catch (err) {
        res.status(500).json("Error fetching logs")
    }
}
// ❌ DELETE FOOD
exports.deleteFood = async (req, res) => {
    const { userId, index } = req.body
    const today = new Date().toISOString().split('T')[0]

    try {
        const log = await foodLogs.findOne({ userId, date: today })

        if (!log) return res.status(404).json("No log found")

        log.foods.splice(index, 1)

        await log.save()
        res.status(200).json(log)

    } catch (err) {
        res.status(500).json("Error deleting food")
    }
}