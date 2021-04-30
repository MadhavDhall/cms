const express = require("express")
const mongoose = require('mongoose');
const db = require("../../db")
const app = express()
const path = require("path")
const { setupRedirect } = require("../../middlewares/setup")
const fs = require('fs');
const confirmScript = require("../../misc functions/confirmScript");
const router = express.Router()
const admins = require("../../models/admins")

const checkDbConn1 = async (req, res, next) => {
    if (await db()) {
        // res.redirect("/admin/setup/2")
        res.json({ message: "Second step not done. Setup.", redirect: "/admin/setup/2" })
    } else {
        next()
    }
}

const checkDbConn2 = async (req, res, next) => {
    if (await db()) {
        next()
    } else {
        // res.redirect("/admin/setup/1")
        res.json({ message: "Setup not done.", redirect: "/admin/setup/1" }).status(500)
    }
}

router.get("/", setupRedirect, async (req, res) => {
    if (await db()) {
        // res.redirect("/admin/setup/2")
        res.json({ message: "Database Connected. Setup next steps.", redirect: "/admin/setup/2" })
    } else {
        res.json({ message: "Database not Connected. Setup initial steps.", redirect: "/admin/setup/1" })
    }
})

router.get("/1", setupRedirect, checkDbConn1, async (req, res) => {
    // res.sendFile(path.join(__dirname, "../../../html/setup1.html"))
    res.json({ message: "Database not Connected. Setup inital step.", success: true })
})

router.post("/1", setupRedirect, checkDbConn1, async (req, res) => {
    try {
        const { username, password, clusterurl } = req.body
        const configContent = `// editing this file on your own might cause error or problem
const dbDetails = {
    DB_USERNAME: "${username}",
    DB_PASSWORD: "${password}",
    DB_CLUSTER_URL: "${clusterurl}"
}
module.exports = dbDetails`

        const dbUrl = `mongodb+srv://${username}:${password}@${clusterurl}?retryWrites=true&w=majority`

        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            fs.writeFile(path.join(__dirname, "../../config.js"), configContent, (e) => {
                if(e) console.log(e);
            })

            res.status(201).json({ message: "Connection successful. Fill next details.", redirect: "/admin/setup/2" })
        })
            .catch((e) => res.status(500).json({ message: "Connection could not be made. Fill all details correctly again.", redirect: "/admin/setup/1" }))

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Connection could not be made. Fill all details correctly again.", redirect: "/admin/setup/1" })
    }
})


// register during setup routes 
// register 
router.get("/2", setupRedirect, checkDbConn2, (req, res) => {
    // res.sendFile(path.join(__dirname, "../../../html/register.html"))
    res.json({ message: "Database Connected. setup next steps.", success: true })
})

router.post("/2", setupRedirect, checkDbConn2, async (req, res) => {
    try {
        const { wname, email, name, password } = req.body

        const admin = new admins({
            email, name, password, owner: true, verified: false
        })
        const verificationEmail = await admin.verificationEmail(wname)

        if (verificationEmail == true) {
            // res.send(confirmScript("Check your Email and click on verification link to verify admin and Get Started.", "/admin"))
            res.status(201).json({ message: "Check your Email and click on verification link to verify admin and Get Started.", redirect: "/admin" })
        } else if(verificationEmail == false) {
            // res.send(confirmScript("This Email is already registered. Try visiting verification link sent on Email", "/admin/login"))
            res.status(500).json({ message: "This Email is already registered. Try visiting verification link sent on Email or if already verified, login and begin with CMS.", redirect: "/admin/login" })
        }else{
            res.status(500).json({ message:"Sending Email failed. Setup second step again.", redirect:"/admin/setup/2"})
        }
    } catch (error) {
        res.status(500).json({ message: "This Email is already registered. Try visiting verification link sent on Email or if already verified login and begin with CMS.", redirect: "/admin/login" })
    }
})

module.exports = router