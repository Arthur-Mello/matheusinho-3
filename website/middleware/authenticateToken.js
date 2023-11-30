const jwt = require('jsonwebtoken');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

function authenticateToken(req, res, next) {
    console.log('Middleware called');

    const token = req.cookies.token;

    // Redirect authenticated users from the root path to /dashboard
    if (req._parsedOriginalUrl && req._parsedOriginalUrl.pathname === "/" && req.user) {
        return res.redirect('/dashboard');
    }

    // Additional logic to skip authentication for the root path
    if (req._parsedOriginalUrl && req._parsedOriginalUrl.pathname === "/") {
        return next();
    }

    if (req._parsedUrl && req._parsedUrl.pathname !== "/login" && !token) {
        return res.redirect(`/?message=errornaologado`);
    }

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) {
            console.log('Error verifying token:', err);
            return res.redirect(`/?message=error`);
        }

        console.log('User authenticated:', user);
        req.user = user;
        console.log(req.user)
        next(); // Continue to the next middleware or route handler
    });
}

module.exports = authenticateToken;
