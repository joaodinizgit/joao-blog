module.exports = function registerIsValid (req, res, next) {
    const regex = /\W/g
    console.log(req.body.user.search(regex));
    if (req.body.user.search(regex) >= 0) {
        console.log("Cannot Register, illegal input")
        res.redirect('/register')
    }else next()
}