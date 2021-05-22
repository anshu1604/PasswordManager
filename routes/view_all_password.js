var express = require('express');   //import express
var router = express.Router();      //create router
var userModule = require('../modules/user');   //import mongodb module
var bcryptjs = require('bcryptjs'); //import bcryptjs
var Cryptr = require('cryptr');
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

//to view all passwords
router.get('/',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var perPage = 4;
    var page = 1;
    passModel.aggregate([
        {
            $match : {username:loginUser}
        }
    ]).skip((perPage*page)- perPage).limit(perPage).exec(function(err, data){
        if (err) throw err;
        passModel.countDocuments({}).exec((err,count)=>{
            res.render('view_all_password',{title:'All Passwords', loginUser:loginUser,
            records:data,
            current:page,
            pages: Math.ceil(count/perPage)
        });
    });
});
});

//pagination route
router.get('/:page',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var perPage = 4;
    var page = req.params.page || 1;
    passModel.aggregate([
        {
            $match : {username:loginUser}
        }
    ]).skip((perPage*page)- perPage).limit(perPage).exec(function(err, data){
        if (err) throw err;
        console.log(data);
        passModel.countDocuments({}).exec((err,count)=>{
        res.render('view_all_password',{title:'All Passwords', loginUser:loginUser,
             records:data,
             current:page,
             pages: Math.ceil(count/perPage)
            });
    });
});
});




module.exports = router;