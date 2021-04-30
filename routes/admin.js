const express = require('express');
const router = express.Router()
const path = require("path")
const fs = require('fs');

const admins = require("../models/admins")
const LoggedInRedirect = require("../middlewares/loggedIn").LoggedInRedirect
const loggedInNext = require("../middlewares/loggedIn").loggedInNext

const setupNext = require("../middlewares/setup").setupNext
const setupRedirect = require("../middlewares/setup").setupRedirect;

const confirmScript = require("../misc functions/confirmScript");
const linkExpired = require("../misc functions/linkExpired");

router.get("/", setupNext, loggedInNext, async (req, res) => {
    const adminsData = await admins.find({ verified: true }, 'email name owner')

    res.json({ message: "Welcome admin.", success: true, data: req.user, admins: adminsData })
})

// confirm email 
router.get("/email-confirm", async (req, res) => {
    const { token, wname } = req.query
    console.log(wname);
    try {
        const find = await admins.findOne({ 'verification.token': token })
        const expiryTime = find.verification.expire_time

        const valid = async () => {
            find.verified = true

            const save = await find.save()
            if (wname !== undefined) {
                console.log(wname);
                const host = req.protocol + "://" + req.get("host")
                const userFile = `// editing this file on your own might cause error or problem
const user = {
    WEBSITE_NAME: "${wname}",
    HOST_NAME: "${host}"
}
module.exports = user`

                fs.writeFile(path.join(__dirname, "../user.js"), userFile, (e) => {
                    if (e) throw e
                })
            }
            res.send(confirmScript("Your Email has been verified. Login and begin with Madhav Dhall CMS", "/admin/login"))
        }

        const expired = async () => {
            await find.remove()

            res.send(confirmScript("Link Expired. Register again", "/admin/setup/2"))
            res.json({
                message: "Link Expired. Register again",
                redirect: "/admin/setup/2"
            })
        }

        if (find.verified == false) {
            linkExpired(expiryTime, expired, valid)
        } else {
            res.send(confirmScript("Your Email is already verified. Login and begin with Madhav Dhall CMS", '/admin/login'))
        }
    } catch (e) {
        console.log(e);
        res.send(confirmScript("Link does not exist.", '/admin/setup/2'))
    }
})

// login routes 
// login 
router.get("/login", setupNext, LoggedInRedirect, (req, res) => {
    res.json({ message: "Login", success: true })
})
router.post("/login", setupNext, LoggedInRedirect, async (req, res) => {
    try {
        const { email, pass } = req.body

        const checkDetails = await admins.checkDetails(email, pass)

        if (checkDetails == false) {
            res.status(400).json({
                message: "Wrong Details",
                redirect: "/admin/login"
            })
        } else if (checkDetails == "notVerified") {
            res.json({
                message: "Your Email is not verified. Verify it first by clicking on confirmation link sent on email.",
                redirect: "/admin/login"
            }).status(400)
        } else {
            res.cookie("jwt", checkDetails, {
                expires: new Date(Date.now() + (120 * 60 * 1000)), //expires after 2 hours
                httpOnly: true
            }).json({
                message: "Login Successful.",
                redirect: "/admin"
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            message: "Wrong Details",
            redirect: "/admin/login"
        }).status(400)
    }
})

// add new admin 
router.get("/add-admin", setupNext, loggedInNext, async (req, res) => {
    res.json({ message: "Add admin", success: true })
})
router.post("/add-admin", setupNext, loggedInNext, async (req, res) => {
    try {
        const { email, name, password } = req.body

        const admin = new admins({
            email, name, password, owner: false, verified: false
        })
        const verificationEmail = await admin.verificationEmail()

        if (verificationEmail != false) {
            res.json({
                message: "Check your Email and click on verification link to verify admin and Get Started.",
                redirect: "/admin"
            }).status(201)
        } else {
            res.json({
                message: "This Email is already registered. Try visiting verification link sent on Email",
                redirect: "/admin/login"
            }).status(500)
        }
    } catch (error) {
        res.json({
            message: "This Email is already registered. Try visiting verification link sent on Email",
            redirect: "/admin/login"
        }).status(500)
    }
})

// logout admin 
router.get("/logout", setupNext, loggedInNext, async (req, res) => {
    try {
        const user = req.user
        const find = await admins.findById(user._id)

        find.tokens = find.tokens.filter((elem) => {
            return elem.token !== req.token
        })
        await find.save()

        res.clearCookie("jwt").json({ message: "Logged out", redirect: "/admin/login" })
    } catch (e) {
        console.log(e);
        res.clearCookie("jwt").json({ message: "Logged out", redirect: "/admin/login" })
    }
})

// logout from all devices 
router.get("/logoutall", setupNext, loggedInNext, async (req, res) => {
    try {
        const user = req.user
        const find = await admins.findById(user._id)

        find.tokens = []
        await find.save()

        res.clearCookie("jwt").json({ message: "Logged out from all devices", redirect: "/admin/login" })
    } catch (e) {
        console.log(e);
        res.clearCookie("jwt").json({ message: "Logged out from all devices", redirect: "/admin/login" })
    }
})

// change details 
router.get("/change-details", setupNext, loggedInNext, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "../../html/changePass.html"))
    } catch (e) {
        res.redirect("/admin/login")
    }
})
// change name 
router.post("/change-name", setupNext, loggedInNext, async (req, res) => {
    try {
        const admin = await admins.findById(req.user._id)
        admin.name = req.body.name
        await admin.save()

        res.status(201).json({ message: "Name changed successfully", redirect: "/admin/profile" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error. Try again.", redirect: "/admin/profile" })
    }
})

// forgot password 
router.get("/forgot-password", setupNext, LoggedInRedirect, async (req, res) => {
    res.json({ message: "Forgot password", success: true })
})
router.post("/forgot-password", setupNext, async (req, res) => {
    try {
        const { email } = req.body
        const sendMail = await admins.changePasswordEmail(email)

        if (sendMail != false) {
            res.status(201).json({
                message: "Check your Email and click on confirmation link to change password.",
                redirect: "/admin/login"
            })
        } else {
            res.json({
                message: "This Email is not registered or verified.",
                redirect: "/admin/forgot-password"
            }).status(500)
        }
    } catch (error) {
        res.json({
            message: "This Email is not registered or verified.",
            redirect: "/admin/forgot-password"
        }).status(500)
    }
})

// confirm change password 
router.get("/change-password", setupNext, async (req, res) => {
    const token = req.query.token

    if (token !== undefined) {
        try {
            const find = await admins.findOne({ 'changePassword.token': token })
            const expiryTime = find.changePassword.expire_time

            const expired = () => {
                res.status(500).json({ message: "Link expired. Generate again.", redirect: "/admin" })
            }
            const valid = async () => {
                find.tokens = []
                await find.save()
                res.clearCookie("jwt").json({ message: "Now reset your password.", success: true })
            }
            linkExpired(expiryTime, expired, valid)
        } catch (e) {
            res.status(500).json({ message: "Link expired or does not exist. Go back and click on change/forgot password again.", redirect: "/admin" })
        }
    } else {
        res.status(500).json({ message: "Token must be provided.", redirect: "/admin" })
    }
})
router.post("/change-password", setupNext, async (req, res) => {
    const token = req.query.token

    if (token !== undefined) {
        try {
            const find = await admins.findOne({ 'changePassword.token': token })
            const expiryTime = find.changePassword.expire_time

            const expired = () => {
                res.status(500).json({
                    message: "Link Expired. Go back and click on change/forgot password again.",
                    redirect: "/admin"
                })
            }
            const valid = async () => {
                find.password = req.body.password
                find.changePassword = {}
                await find.save()

                res.status(201).clearCookie("jwt").json({
                    message: "Password changed successfully.",
                    redirect: "/admin/login"
                })
            }
            linkExpired(expiryTime, expired, valid)
        } catch (e) {
            res.statis(500).json({
                message: "Link Expired or does not exist. Go back and click on change/forgot password again.",
                goBack: true
            })
        }
    } else {
        res.status(500).json({ message: "Token must be provided.", redirect: "/admin" })
    }
})

module.exports = router