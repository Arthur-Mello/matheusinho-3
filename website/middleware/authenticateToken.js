const jwt = require('jsonwebtoken');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

function authenticateToken(req, res, next) {
    console.log('Middleware called');

    const token = req.cookies.token;

    if (!token) {
     
        return next();
    }

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) {
            console.log('Error verifying token:', err);
        
            return next();
        }

        console.log('User authenticated:', user);
        req.user = user;

     
        if (!res.headersSent) {
      
            return res.redirect("/dashboard");
        }
    });

    return next();
}





module.exports = authenticateToken;
