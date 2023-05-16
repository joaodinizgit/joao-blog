const express = require('express')
const app = express()
const registerIsValid = require('./middlewares/register-validation.js');
const session = require('express-session')
const escapeHtml = require('escape-html')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 3000

const sqlite3 = require('sqlite3').verbose();

// Connect to the database
function connectToDb() {
    return new sqlite3.Database('./db/users3.db')
}

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
    //  TODO: validate inputs more
    console.log(req.body)
    // The code bellow will execute only if passed in registerIsValid middleware
    // Hash the password
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.pass, salt, function(err, hash) {

            // Record in database with password hashed
            const db = connectToDb();
            db.serialize(() => {
                db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, pass TEXT NOT NULL, timestamp DEFAULT CURRENT_TIMESTAMP)");
                // TODO: check if username exist in database

                db.run("INSERT INTO users(user, pass) VALUES (?, ?)", req.body.user, hash)
                db.all("SELECT * FROM users;", (err, all) => {
                    console.log(all)
                })
            });
            
            db.close();
        });
    });    
    req.session.message = "Register success"
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