const jwt = require("jsonwebtoken")

const jwtMiddleware = (req, res, next) => {
    console.log(`inside jwt jwtMiddleware`);
    // console.log(req.headers.authorization)
    const token = req.headers.authorization.split(" ")[1]
    // const token = req.headers.authorization.replace('Bearer ', '')
    // console.log(token);

    try {
        const jwtResponse = jwt.verify(token, process.env.JWT_SecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.email
        next()

    } catch (err) {
        res.status(401).json(`invalid token, ${err}`)
    }

}

module.exports = jwtMiddleware