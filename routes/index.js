var express = require('express');   //import express
var router = express.Router();      //create router
var userModule = require('../modules/user');   //import mongodb module
var bcryptjs = require('bcryptjs'); //import bcryptjs
var jwt = require('jsonwebtoken');
const{check, validationResult} = require('express-validator');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});
//requiring localstorage module
if(typeof localStorage === 'undefined' || localStorage === null){
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

//middleware for checking whether the user is logged in or not
function checkLoginUser(req, res, next){
    var userToken = localStorage.getItem('userToken');
    try{
        var decoded = jwt.verify(userToken, 'loginToken');
    }
    catch(err){
        return res.redirect('/');
    }
    next();
}

//middleware to check email
function checkEmailExistence(req,res,next){
    var email = req.body.mail;
    var checkEmail = userModule.findOne({email:email});
    checkEmail.exec((err,data)=>{
        if (err) throw err;
        if (data) {
            return res.render('signup',{title:'Register a New Account', 
            message:'Email already exist'});
        }
        next();
    });
    
}

//middleware to check username
function checkusername(req,res,next){
    var uname = req.body.uname;
    var checkUsername = userModule.findOne({username:uname});
    checkUsername.exec((err,data)=>{
        if (err) throw err;
        if (data){
            return res.render('signup',{title:'Register a New Account', 
            message:'Username already exist'});
        }
        next();
    });
}

//to get home page
router.get('/', function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    if (loginUser){
        res.redirect('../dashboard');
    }
    else{
        res.render('index',{message:'', title:'Login'});
    }
});

//to submit the values for login
router.post('/', function(req,res){
    var username = req.body.name;
    var password = req.body.pswd;
    var checkuser = userModule.findOne({username:username});
    checkuser.exec((err,data)=>{
        if (err){
            console.log('error');
        }
        if (data){
            var getUserid = data._id;
            var getPassword = data.password;
            if (bcryptjs.compareSync(password,getPassword)){
                var token = jwt.sign({userID:getUserid},'loginToken');
                localStorage.setItem('userToken', token);
                localStorage.setItem('userid', getUserid);
                localStorage.setItem('loginUser', username);
                res.redirect('/dashboard');
            }
            else{
                res.render('index',{title:'Login', message:'Invalid Username or Password'});
            }
        }
        else{
            res.render('index',{title:'Login', message:'User not Registered'});
        }
    })
    
});

//to get register page
router.get('/signup', function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    if (loginUser){
        res.redirect('../dashboard');
    }
    else{
        res.render('signup',{title:'Register', message:''});
    }
});

//to submit data of signup page
router.post('/signup',[checkusername, checkEmailExistence], function(req,res){
    var fullname = req.body.name;
    var username = req.body.uname;
    var email = req.body.mail;
    var password = req.body.pswd;
    var confpassword = req.body.repswd;
    if (password != confpassword){
        res.render('signup',{title:'Register', message:'Password not matched'});
    }
    else{
        password = bcryptjs.hashSync(password,10);
        var userDetails = new userModule({
            fullname:fullname,
            username:username,
            email:email,
            password:password,
        });
        userDetails.save((err,doc)=>{
            if (err) throw err;
            res.render('signup',{title:'Register', message:'User Registered Successfully'});
        })
    }
    
});

//to redirect after logout
router.get('/logout', function(req,res){
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/dashboard');
})

//to export the router
module.exports = router;