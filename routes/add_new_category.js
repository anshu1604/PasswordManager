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

//to add new password category
router.get('/',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    res.render('add_new_category',{title:'Add New Category', loginUser:loginUser, errors:'', success:''});
});

//post method to add new category
router.post('/',checkLoginUser,[check('pswdcat', 'Enter Password Category Name').isLength({min:1})]  , function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.render('add_new_category',{title:'Add New Category', loginUser:loginUser, errors:errors.mapped(), success:''});
    }
    else{
        var passCatName =  req.body.pswdcat;
        var passCatDetails = new passCatModel({
            password_category: passCatName,
            username: loginUser
        });
        passCatDetails.save(function(err,doc){
            if (err) throw err;
            res.render('add_new_category',{title:'Add New Category', loginUser:loginUser, errors:'', 
            success:'Password Category Inserted Successfully'});
        })
        
    }
});

module.exports = router;