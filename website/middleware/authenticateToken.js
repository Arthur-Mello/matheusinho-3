const jwt = require('jsonwebtoken');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

function authenticateToken(req, res, next) {
    console.log('Middleware called');

    const token = req.cookies.token;

  
    if (req._parsedOriginalUrl && req._parsedOriginalUrl.pathname === "/" && req.user) {
        return res.redirect('/dashboard');
    }

    
    if (req._parsedOriginalUrl && req._parsedOriginalUrl.pathname === "/") {
        return next();
    }

    if (req._parsedUrl && req._parsedUrl.pathname !== "/login" && !token) {
        res.redirect(`/?message=errornaologado`);
        return; 
    }

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Token expired:', err.expiredAt);
                res.redirect(`/?message=tokenexpired`);
            } else {
                console.log('Error verifying token:', err);
                res.redirect(`/?message=error`);
            }
            return;
        }

        console.log('User authenticated:', user);
        req.user = user;
        next(); 
    });
}

module.exports = authenticateToken;
