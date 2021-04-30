const express = require('express');
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
require("./db")

// dotenv.config({ path: path.join(__dirname, "./config.env") })

const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/cms-admin", require("./routes/admin"))
app.use("/cms-admin/setup", require("./routes/setup/setup"))

// if (process.env.NODE_ENV === "production") {
app.use(express.static("./client/build"))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})
// }

const port = process.env.PORT || 7000
app.listen(port, () => {
    console.log(`server at port- ${port}`);
})