function isMedic(req, res, next) {

    if (req.user.cargo === "Médico") {
        return next();
    }

    res.clearCookie('token');

    return res.redirect(`/?message=errorpermissao`)
}

module.exports = isMedic