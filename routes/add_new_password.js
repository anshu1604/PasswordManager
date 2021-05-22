var express = require('express');   //import express
var router = express.Router();      //create router
var userModule = require('../modules/user');   //import mongodb module
var bcryptjs = require('bcryptjs'); //import bcryptjs
var Cryptr = require('cryptr'); //import cryptr
var cryptr = new Cryptr('anshu');
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

//to add new password
router.get('/',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    passCatModel.aggregate([
        {
            $match : {username:loginUser}
        }
    ]).exec(function(err,data){
        if (err) throw err;
        res.render('add_new_password',{title:'Add New Password', loginUser:loginUser, records:data, success:''});
    })
});

//to submit the password details using post method
router.post('/',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var pass_cat = req.body.category;
    var project_name = req.body.project;
    var pass_details = req.body.pswddetails;
    var crypt_pass = cryptr.encrypt(pass_details);
    var password_details = new passModel({
        password_category:pass_cat,
        project_name:project_name,
        password_details:crypt_pass,
        username:loginUser
    });
    password_details.save(function(err,doc){
        getPassCat.exec(function(err,data){
            if (err) throw err;
            res.render('add_new_password',{title:'Add New Password', loginUser:loginUser, records:data, success:'Password Details Inserted Successfully'});
    })
    })
});

module.exports = router;