const jwt = require('jsonwebtoken');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

function authenticateToken(req, res, next) {
    

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
        res.redirect(`/?message=errornaologado`);
        return; // Add a return statement to exit the function after redirect
    }

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
            
                res.redirect(`/?message=tokenexpired`);
            } else {
               
                res.redirect(`/?message=error`);
            }
            return; // Add a return statement to exit the function after redirect
        }

        req.user = user;
        next(); // Continue to the next middleware or route handler
    });
}

module.exports = authenticateToken;
