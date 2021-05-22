var express = require('express'); //to import express

var path = require('path'); //to import path 

var cookieParser =  require('cookie-parser');  //to import cookie-parser

var Index_Router = require('./routes/index'); //to import index.js file from routes folder

var Dashboard_Router = require('./routes/dashboard');

var addNewCat_Router = require('./routes/add_new_category');

var viewCat_Router = require('./routes/password_category');

var addNewPass_Router = require('./routes/add_new_password');

var viewPass_Router = require('./routes/view_all_password');

var editPass_Router = require('./routes/password_details');

var app = express(); //all the properties of express are now in app

app.set('view engine','ejs'); //to tell express which template engine will be used

app.use(express.urlencoded({
    extended: true
}));

app.use('/', Index_Router); //to tell express that these routes exist

app.use('/dashboard', Dashboard_Router);

app.use('/add_new_category', addNewCat_Router);

app.use('/password_category', viewCat_Router);

app.use('/add_new_password', addNewPass_Router);

app.use('/view_all_password', viewPass_Router);

app.use('/password_details', editPass_Router);

app.use(express.static(path.join(__dirname, 'public/css'))); //declaring the folder static

var PORT = process.env.PORT || 3000; //to check the environment variable

app.listen(PORT); //to create server