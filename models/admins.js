const path = require('path');
const user = require("../user")
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const generateToken = require("../misc functions/generateUniqueToken");
const sendMail = require("../misc functions/sendMail");

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    owner: Boolean,
    verification: {
        token: String,
        expire_time: Date
    },
    verified: Boolean,
    changePassword: {
        token: String,
        expire_time: Date
    },
    tokens:[
        {
            token:String
        }
    ]
})

// generate token for verification 
schema.methods.verificationEmail = async function (wname) {
    try {
        const rand = Math.floor((10000 * Math.random()) + 1)
        const hash = bcrypt.hashSync(rand + this._id, 10)

        this.verification.token = hash
        this.verification.expire_time = Date.now() + 60 * 60 * 1000

        const name = this.name

        const link1 = `${user.HOST_NAME}/admin/email-confirm?token=${hash}&wname=${wname}`
        const link2 = `${user.HOST_NAME}/admin/email-confirm?token=${hash}`

        const link = (wname !== undefined ? link1 : link2)

        await this.save()
        const mailOptions = {
            to: this.email,
            subject: 'Email Confirmation for Madhav Dhall CMS Admin',
            html: `<h4>Hello ${name}</h4><br/> 
            <p>We received a Registration request for Madhav Dhall CMS on this email. If you requested for it then click the link below and if you have not requested then just ignore this Email.</p><br/><br/>
            <a target="_blank" href="${link}">${link}</a><br/>
            If this link does not get clicked. Paste it in browser.<br/><br/>
            Thanks, Madhav Dhall CMS`,
            text: `Hello ${name}. We received a Registration request for Madhav Dhall CMS on this email. If you requested for it then paste the link below in Browser and if you have not requested then just ignore this Email. Confirmation Link- ${link}`
        }

        return sendMail(mailOptions)
    } catch (e) {
        return false
    }
}

// change password/forgot password 
schema.statics.changePasswordEmail = async function (email) {
    try {
        const admin = await this.findOne({ email, verified: true })

        admin.changePassword.token = generateToken(await admin._id)
        admin.changePassword.expire_time = Date.now() + 60 * 60 * 1000

        await admin.save()
        const link = `${user.HOST_NAME}/admin/change-password?token=${admin.changePassword.token}`
        const mailOptions = {
            to: email,
            subject: 'Change Password Confirmation for Madhav Dhall CMS',
            html: `<h4>Hello ${admin.name}</h4><br/> 
            <p>We received a Change Password request for Madhav Dhall CMS on this email. If you requested for it then click the link below and if you have not requested then just ignore this Email.</p><br/><br/>
            <a target="_blank" href="${link}">${link}</a><br/><br/>
            Thanks, Madhav Dhall CMS`,
            text: `Hello ${admin.name} .We received a Change Password request for Madhav Dhall CMS on this email. If you requested for it then click the link below and if you have not requested then just ignore this Email. Confirmation Link- ${link}`
        }
        sendMail(mailOptions)

    } catch (e) {
        return false
    }
}

// check login details 
schema.statics.checkDetails = async function (email, checkPass) {
    try {
        const find = await this.findOne({ email })
        const realPass = await find.password

        const check = await bcrypt.compare(checkPass, realPass)

        if (check) {
            if (find.verified) {
                // generate jwt ouath token and store in cookie and database
                const token = jwt.sign({ _id: find._id.toString() }, process.env.JWT_SECRET_KEY)

                find.tokens = find.tokens.concat({token})
                await find.save()
                return token
            } else {
                return "notVerified"
            }
        } else {
            return false
        }
    } catch (e) {
        console.log(e);
        return false
    }
}

// generate jwt tokens for auth
schema.methods.generateAuthTokens = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET_KEY)
        return token
    } catch (e) {
        console.log(e);
    }
}

// hash the password before storing in database
schema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const pass = this.password
        const hashedPass = bcrypt.hashSync(pass, 10)
        this.password = hashedPass
    }
    next()
})

const Model = mongoose.model("admin", schema)


module.exports = Model