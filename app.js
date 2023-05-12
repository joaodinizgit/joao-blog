const express = require('express')
const app = express()

app.set("view engine", "ejs")

const port = 3000

// To take objects from a form
app.use(express.urlencoded( {extended: true}))
//app.use(express.json()) // for parsing application/json

app.use(express.static('public'))

// Routes
app.get("/", (req, res) => {
    res.render("index", {title: "Index"})
})

app.get("/user", (req, res) => {
    res.render("user", {title: "User Page", titlepage: "Users"})
})

app.route("/login") 
.get((req, res) => {
    res.render("login", {title: "Login"})
})
.post((req, res) => {
    const login = req.body
    console.log(login)
    res.redirect("/")
})

app.get("/register", (req, res) => {
    res.render("register", {title: "Register"})
})

app.get("/post", (req, res) => {
    res.render("post", {title: "Post Area"})
})

app.post("/post/newpost", (req, res) => {
    const post = req.body
    console.log(post)
    res.send("Got your post")
    //res.json(post)
})

// Server listening
app.listen(3000, () => {
    console.log(`Listen at port ${port}`)
})