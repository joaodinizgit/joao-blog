const express = require('express')
const app = express()

app.set("view engine", "ejs")

const port = 3000

// To take objects from a form
app.use(express.urlencoded( {extended: true}))
//app.use(express.json()) // for parsing application/json

app.use(express.static('public'))

// Example
const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}
  
app.use(myLogger)
////

// Example
const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
  }
  
  app.use(requestTime)
///


app.get("/", (req, res) => {
    res.render("layout", {title: "Index Page", titlepage:"Index"})
})

app.get('/teste', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${req.requestTime}</small>`
    res.send(responseText)
  })

app.get("/user", (req, res) => {
    res.render("layout", {title: "User Page", titlepage: "Users"})
    
})

app.get("/post", (req, res) => {
    res.send("Post Area")
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