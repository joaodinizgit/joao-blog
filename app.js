const express = require('express')
const app = express()
const inputRegisterAreValid = require('./middlewares/register-validation.js');
const userIsRegistered = require('./middlewares/check-user-register.js');
const slugGenerator = require('./middlewares/slug-generator.js');
const session = require('express-session')
const escapeHtml = require('escape-html')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 3000

const sqlite3 = require('sqlite3').verbose();

// Connect to the database
function connectToDb() {
    return new sqlite3.Database('./db/blog.db')
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
    
    // Load posts
    const db = connectToDb();
    db.serialize(() => {
        // Retrieve from database five recent post to show in main page.
        db.all("SELECT users.user, posts.title, posts.postId, posts.text, posts.timestamp" + 
                    " FROM users" +
                    " INNER JOIN posts" +
                    " ON users.id = posts.authorId" +
                    " ORDER BY posts.timestamp" + 
                    " DESC LIMIT 15", (err, rows) => {
            console.log(rows)  
            res.render("index", {title: "Index", posts: rows }) 
        })
    });
})

app.post('/register',inputRegisterAreValid, (req, res) => {
    // TODO: Improve validate inputs
    console.log(req.body)
    // Hash the password.
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.pass, salt, function(err, hash) {
            // Record in database with password hashed.
            const db = connectToDb();
            db.serialize(() => {
                db.run("CREATE TABLE IF NOT EXISTS" +
                " users (id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " user TEXT NOT NULL," + 
                " pass TEXT NOT NULL," + 
                " email TEXT," + 
                " timestamp DEFAULT CURRENT_TIMESTAMP)");
                // Check if username exist in database, if not it will record in database.
                db.get("SELECT * FROM users WHERE user=?",req.body.user, (err, row) => {
                    if (row == undefined) {
                        db.run("INSERT INTO users(user, pass, email, name) VALUES (?, ?, ?, ?)", req.body.user, hash, req.body.email, req.body.name);
                        db.close();
                        req.session.message = "Register success!"
                        res.redirect('/')
                    } else {
                        db.close();
                        req.session.message = "Username not available. Choose another."
                        res.redirect('/register')
                    }
                })
            });
        });
    });    
})

app.get('/register', (req, res) => {
    res.render("register", {title: "Register"})
})

//  Start Session 
app.get('/login', (req, res) => {
    res.render("login", {title: "Login"})
})

app.post('/login', userIsRegistered, (req, res) => {
    // TODO: Login logic to validate req.body.user and req.body.pass before check in db
    
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate((err) => {
        if (err) next(err)
    
        // store user information in session, typically a user id
        req.session.user = req.body.user
        req.session.userId = req.userId;
    
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
    req.session.userId = null

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

app.route("/newpost")
.get(isAuthenticated,(req, res) => {
    res.render("newpost", {title: "New Post"})
})
.post(isAuthenticated, slugGenerator, (req, res) => {
    // TODO: Improve user inputs before insert in database.
    const post = req.body
    console.log("LLLLLLL :",res.locals.titlePostSlug)
    //console.log(post)
    // Insert in database
    const db = connectToDb();
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS posts (" + 
        " postId INTEGER PRIMARY KEY AUTOINCREMENT," +
        " authorId INTERGER NOT NULL," +
        " title TEXT NOT NULL," + 
        " text TEXT NOT NULL," + 
        " titleSlug TEXT" +
        " timestamp DEFAULT CURRENT_TIMESTAMP," +
        " FOREIGN KEY(authorId) REFERENCES users (id))");

        db.run("INSERT INTO posts(authorId, title, text, titleSlug) VALUES (?, ?, ?, ?)", req.session.userId, post.title, post.text, res.locals.titlePostSlug);
    });
    db.close()
    res.redirect('/')
})

// Route for a specific post.
// TODO: Use a slug.
app.get('/post/:postId', (req, res) => {
    res.send(req.params)
})

// Server listening
app.listen(3000, () => {
    console.log(`Listen at port ${port}`)
})