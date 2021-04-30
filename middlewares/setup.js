const dotenv= require("dotenv")
dotenv.config({path:"../.env"})

const db = require("../db")
const admins = require("../models/admins")

const checkSetup = async (req, res, next) => {
    try {
        if (await db()) {
            const admin = await admins.exists({ verified: true })

            if (admin) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const setupNext = async (req, res, next) => {
    try {
        if (await checkSetup()) {
            next()
        } else {
            // res.redirect("/admin/setup")
            res.status(500).json({ message: "Setup not done, do it first", redirect: "/admin/setup" })
        }
    } catch (e) {
        // res.redirect("/admin/setup")
        res.status(500).json({ message: "Setup not done, do it first", redirect: "/admin/setup" })
    }
}

const setupRedirect = async (req, res, next) => {
    try {
        if (await checkSetup()) {
            // res.redirect("/admin")
            res.json({ message: "Setup done already", redirect: "/admin" }).status(500)
        } else {
            next()
        }
    } catch (e) {
        next()
    }
}
module.exports.setupNext = setupNext
module.exports.setupRedirect = setupRedirect