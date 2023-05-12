# João Blog Construction

## Create a directory

    mkdir joaoblog

## create the manual.md

Create this manual.md to register the process.

## Create a package

    npm init

## Install Express

    npm install express

## Create app.js

    touch app.js

# Install Nodemon

Install Nodemon to not have to re-start every time a change is made

    $ npm install nodemon --save-dev

Add in the script:

    "devStart": "nodemon app.js"

to Execute

    npm run devstart

## Create a public path to serve, images, css and java script files
    
    express.static(root, [options])

  

    app.use(express.static('public'))

Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL.

    http://localhost:3000/images/kitten.jpg
    http://localhost:3000/css/style.css
    http://localhost:3000/js/app.js
    http://localhost:3000/images/bg.png
    http://localhost:3000/hello.html

## The paths should  be like this

    .
    ├── app.js
    ├── bin
    │   └── www
    ├── package.json
    ├── public
    │   ├── images
    │   ├── javascripts
    │   └── stylesheets
    │       └── style.css
    ├── routes
    │   ├── 
    │   └── 
    └── views
        ├── footer.ejs
        ├── header.ejs
        ├── index.ejs
        ├── login.ejs
        ├── post.ejs
        ├── register.ejs
        └── layout.ejs


## req.body

Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as `express.json()` or `express.urlencoded()`.

## Middlewares

Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.


Execute any code.
Make changes to the request and the response objects.
End the request-response cycle.
Call the next middleware in the stack.

## Install a Template Engine

Choosed EJS

    npm install ejs

Pass EJS a template string and some data.

```js
let ejs = require('ejs');
let people = ['geddy', 'neil', 'alex'];
let html = ejs.render('<%= people.join(", "); %>', {people: people});
```

Create o folder called "views" and a file called "index.ejs"

    app.set("view engine", "ejs")

## Serving Static Files

To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.

The function signature is:

    express.static(root, [options])

The root argument specifies the root directory from which to serve static assets. For more information on the options argument, see express.static.

For example, use the following code to serve images, CSS files, and JavaScript files in a directory named public:

    app.use(express.static('public'))


## Session to Authentication


    npm install escape-html

    npm install express-session
