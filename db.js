const path = require('path');
// const dotenv = require("dotenv")
// dotenv.config({ path: path.join(__dirname, "./config.env") })
const dbDetails = require("./config")

const mongoose = require('mongoose');

const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER_URL } = dbDetails

const dbUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER_URL}?retryWrites=true&w=majority`

const db = async () => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        return true
    } catch (e) {
        return false
    }
}

module.exports = db