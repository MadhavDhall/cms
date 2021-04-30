const bcrypt = require("bcryptjs")

const generateToken = (id) => {
    const randNo = Math.floor((10000 * Math.random()) + 1)
    const hash = bcrypt.hashSync(randNo + id, 10)

    return hash
}

module.exports = generateToken