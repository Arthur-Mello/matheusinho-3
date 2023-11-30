const jwt = require('jsonwebtoken');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

function alrealdyAuthenticated(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, config.secretKey, (err, user) => {
            err ? next() : null;
            if (err) {
                return next()
            }
            req.user = user;
            return res.redirect(`/dashboard`)
        });
    }
    return next();
}

module.exports = alrealdyAuthenticated;
