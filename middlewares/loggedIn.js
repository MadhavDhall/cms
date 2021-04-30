const dotenv = require("dotenv")
dotenv.config({ path: "../.env" })

const jwt = require("jsonwebtoken")
const admins = require("../models/admins")

const jwtChecker = async (req) => {
    try {
        const token = req.cookies.jwt
        const checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const admin = await admins.findOne({ _id: checkToken._id, verified: true, 'tokens.token': token })

        return admin != null ? { admin, token } : false
    } catch (e) {
        return false
    }
}

const LoggedInRedirect = async (req, res, next) => {
    try {
        const checkJwt = await jwtChecker(req)
        if (checkJwt != false) {
            req.user = checkJwt.admin
            res.json({ message: "Logged In", redirect: "/admin" })
        } else {
            next()
        }
    } catch (e) {
        next()
    }
}

const loggedInNext = async (req, res, next) => {
    try {
        const checkJwt = await jwtChecker(req)
        if (checkJwt != false) {
            req.user = checkJwt.admin
            req.token = checkJwt.token
            next()
        } else {
            // res.redirect("/admin/login")
            res.status(500).json({ message: "Log in first", redirect: "/admin/login" })
        }
    } catch (e) {
        // res.redirect("/admin/login")
        res.status(500).json({ message: "Log in first", redirect: "/admin/login" })
    }
}

module.exports.LoggedInRedirect = LoggedInRedirect
module.exports.loggedInNext = loggedInNext