const express = require('express')
const router = express.Router()
const jwtMiddleware = require('./middlewares/jwtMiddleware')
const { registerUser, loginUser, gatherUserData, logUserWorkout, fetchWorkoutLog, setWaterIntake, searchFood, logWater, getWaterLog, logFood, getFoodLog, deleteFood } = require('./controllers/userController')

// router.get('/admin/allPayments', jwtMiddleware, adminGetAllPayments)
router.post('/registerUser', registerUser)
router.post('/loginUser', loginUser)
router.post('/gatherUserData', jwtMiddleware, gatherUserData)
router.post('/logUserWorkout', jwtMiddleware, logUserWorkout)
router.get('/fetchWorkoutLog', jwtMiddleware, fetchWorkoutLog)
router.post('/setWaterIntake', jwtMiddleware, setWaterIntake)
router.post('/logWater', jwtMiddleware, logWater)
router.get('/getWaterLog', jwtMiddleware, getWaterLog)

router.post('/searchFood', searchFood)
router.post('/add-food', jwtMiddleware, logFood)
router.get('/get-food/:userId', jwtMiddleware, getFoodLog)
router.delete('/delete-food', jwtMiddleware, deleteFood)





module.exports = router