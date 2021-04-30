const linkExpired = async (expiredTime, expired, notExpired) => {
    const expireAt = Date.parse(expiredTime)

    if (Date.now() >= expireAt) {
        return expired()
    }else{
        return notExpired()
    }
}

module.exports = linkExpired