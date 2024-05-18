const express = require('express');
const app = express();
const fileUpload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
// dotenv 
require('dotenv').config(); 

// View engine and layouts setup
const expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs'); //setting up template engine
app.set('layout', 'layouts/main'); // setting up layouts
app.use(expressLayouts);  //running layouts with middleware


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'Hey hey hey',
    saveUninitialized: true,
    resave: true,
}))
app.use(flash());
app.use(fileUpload());


// Routes
const routes = require('./server/routes/indexRoutes');
app.use("/", routes);

// Server
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}`);
});

