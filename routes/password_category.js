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

//to get password category page
router.get('/',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    passCatModel.aggregate([
        {
            $match:{
                username : loginUser
            }
        }
    ]).exec(function(err,data){
        if (err) throw err;
        res.render('password_category',{title:'Password Category', loginUser:loginUser, records:data});
    });
});

//to delete password category
router.get('/delete/:id',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var passcatDelete = passCatModel.findByIdAndDelete(passcat_id);
    passcatDelete.exec(function(err){
        if (err) throw err;
        res.redirect('/password_category');
    })
});

//to edit password category
router.get('/edit/:id',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var passcatEdit = passCatModel.findById(passcat_id);
    passcatEdit.exec(function(err,data){
        if (err) throw err;
        res.render('edit_pass_category',{title:'Edit Password Category', loginUser:loginUser,errors:'', success:'', 
        records:data, id:passcat_id});
    })
});

//to submit edited category using post request
router.post('/edit/',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.body.id;
    var passwordCategory = req.body.pswdcat;
    var update_passcat = passCatModel.findByIdAndUpdate(passcat_id,
        {password_category:passwordCategory});
    update_passcat.exec(function(err,doc){
        if (err) throw err;
        res.redirect('/password_category');
    })
});


module.exports = router;