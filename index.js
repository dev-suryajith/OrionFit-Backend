require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router')
require('./connection')

const orion_server = express()
orion_server.use(cors())
orion_server.use(express.json())
orion_server.use(router)

// orion_server.use("/ProfileImageUploads", express.static("./ProfileImageUploads"))

const PORT = 3300

orion_server.listen(PORT, () => {
    console.log(`OrionFit Server Started Running At Port ${PORT}`)
})