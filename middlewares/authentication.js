const { validateToken } = require("../services/authentication")


const checkForAuthenticationCookies = (cookieName) => {
    return (req, res, next) => {
        const tokenCookievalue = req.cookies[cookieName]

        if (!tokenCookievalue) {
            return next()
        }

        try {
            const payload = validateToken(tokenCookievalue)
            req.user = payload;
        } catch (error) { }

        return next();

    }
}


module.exports = {
    checkForAuthenticationCookies
}