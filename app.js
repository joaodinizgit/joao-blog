const express = require('express')
const app = express()
const registerIsValid = require('./middlewares/register-validation.js');
const session = require('express-session')
const escapeHtml = require('escape-html')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 3000
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users3.db')


db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)");

    db.run("INSERT INTO users(username) VALUES ('do')");
    
});

db.close();


app.set("view engine", "ejs")

// To take objects from a form
app.use(express.urlencoded( {extended: true}))
//app.use(express.json()) // for parsing application/json

app.use(express.static('public'))

app.use(session({
    secret: 'anything',
    resave: false,
    saveUninitialized: true
}))

// Middleware to send custom messages to client
app.use(function (req, res, next) { 
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

// Middleware to check if user is logged
app.use(function (req, res, next) { 
    res.locals.usr1 = req.session.user
    next()
})

// Middleware to test if the client is authenticated
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else res.redirect('/')
}

// Routes
app.get('/', (req, res) => {
    res.render("index", {title: "Index"})
})

app.post('/register',registerIsValid, (req, res) => {
    //  TODO: validate inputs
    console.log(req.body)
    res.redirect('/')
})

app.get('/register', (req, res) => {
    res.render("register", {title: "Register"})
})

//  Start Session 
app.get('/login', (req, res) => {
    res.render("login", {title: "Login"})
})

app.post('/login', (req, res) => {
    console.log(req.body)
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
    // Hash the password:
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.pass, salt, function(err, hash) {
            // Store hash in your password DB.
            console.log("Password hashed: ",hash)
        });
    });
  
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate((err) => {
        if (err) next(err)
    
        // store user information in session, typically a user id
        req.session.user = req.body.user
        console.log(req.session.user)
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save((err) => {
            if (err) return next(err)
            res.redirect('/')
        })
    })
})
  
app.get('/logout', (req, res, next) => {
    // logout logic
    
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null

    req.session.save((err) => {
        if (err) next(err)
    
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
            if (err) next(err)
            res.redirect('/')
        })
    })
})

// Routes for New Posts
app.route("/newpost")
.get(isAuthenticated,(req, res) => {
    res.render("newpost", {title: "New Post"})
})
.post(isAuthenticated,(req, res) => {
    const post = req.body
    console.log(post)
    res.send("Got your post")
})

// Server listening
app.listen(3000, () => {
    console.log(`Listen at port ${port}`)
})