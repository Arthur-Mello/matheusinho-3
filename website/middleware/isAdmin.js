function isAdmin(req, res, next) {

    if (req.user.cargo === "Admin") {
        return next();
    }

    res.clearCookie('token');

    return res.redirect(`/?message=errorpermissao`)
}

module.exports = isAdmin
