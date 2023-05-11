const express = require('express')
const app = express()

const port = 3000

app.use(express.urlencoded( {extended: false }))
app.use(express.json()) // for parsing application/json

app.use(express.static('public'))

app.get("/", (req, res) => {
    res.send("Home")
})

app.get("/user", (req, res) => {
    res.send("User Area")
})

app.get("/post", (req, res) => {
    res.send("Post Area")
})

app.post("/post/newpost", (req, res) => {
    const post = req.body
    console.log(post)
    res.send("Got your post")
    
})


// Server listening
app.listen(3000, () => {
    console.log(`Listen at port ${port}`)
})