module.exports = function registerIsValid (req, res, next) {
    const regex = /\W/g
    res.locals.test = " "
    console.log(req.body.user.search(regex));
    if (req.body.user.search(regex) >= 0) {
        req.session.message = "Only alphanumeric or underline characters are permitted at username"
        res.redirect('/register')
    }else next()
}