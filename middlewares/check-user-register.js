const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Check if user is registered
module.exports = function userIsRegistered (req, res, next) {
    const db = new sqlite3.Database('./db/blog.db')
    db.serialize(() => {
        db.get("SELECT * FROM users WHERE user=?", req.body.user, (err, row) => {
            db.close();
            if (row == undefined) {
                req.session.message = "User don't exist!"
                res.redirect('/login')
            } else {
                // Compare password hashed from database with input.
                bcrypt.compare(req.body.pass, row.pass, function(err, result) {
                    if (result) {
                        req.userId = row.id;
                        req.session.message = "Login successfully!"
                        next()
                    } else {
                        req.session.message = "Wrong password!"
                        res.redirect('/login')
                    }
                });
            }
        })
    })
}