const jwt = require('jsonwebtoken');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

function authenticateTokenLogin(req, res, next) {
    console.log('Middleware called');

    const token = req.cookies.token;

    if (!token) {
    
        return res.redirect("/?message=errornaologado");
    }

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) {
            console.log('Error verifying token:', err);
          
            return res.redirect("/?message=errornaologado");
        }

        console.log('User authenticated:', user);
        req.user = user;

       
        next();
    });
}

module.exports = authenticateTokenLogin;
