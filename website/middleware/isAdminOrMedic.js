function isAdminOrMedic(req, res, next) {

    if (req.user.cargo === "Médico" || req.user.cargo === "Admin") {
        return next();
    }

    res.clearCookie('token');

    return res.redirect(`/?message=errorpermissao`)
}

module.exports = isAdminOrMedic
