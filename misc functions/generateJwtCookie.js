const generateCookie = (jwtToken) => {
    const cookie = res.cookie("jwt", jwtToken, {
        expires : new Date(Date.now() + (120 *60 * 1000)), //expires after 2 hours
        httpOnly: true
    })
    return cookie
}

module.exports = generateCookie