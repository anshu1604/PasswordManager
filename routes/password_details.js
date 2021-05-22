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

//to redirect to dashboard
router.get('/', checkLoginUser, function(req,res){
    res.redirect('/dashboard');
})




//to edit password details
router.get('/edit/:id',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var getPassDetails = passModel.findById({_id:id});
    getPassDetails.exec(function(err, data){
        if (err) throw err;
        var det = cryptr.decrypt(data.password_details);
        passCatModel.aggregate([
            {
                $match : {username:loginUser}
            }
        ]).exec(function(err,data1){
            res.render('edit_passwordDetails',{title:'Edit Password Details', loginUser:loginUser, decrypted_det: det , records:data, record:data1, success:'', errors:''});
        })
            
        })
});

//post method to submit the edited details of password
router.post('/edit/:id',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var passcat = req.body.category;
    var proname = req.body.project;
    var passdetails = req.body.pswddetails;
    var passdet = cryptr.encrypt(passdetails);
    passModel.findByIdAndUpdate(id,{password_category:passcat, project_name:proname, 
        password_details:passdet}).exec(function(err){
            if (err) throw err;
    var getPassDetails = passModel.findById({_id:id});
    getPassDetails.exec(function(err, data){
        if (err) throw err;
        getPassCat.exec(function(err,data1){
            res.render('edit_passwordDetails',{title:'Edit Password Details', loginUser:loginUser, decrypted_det:'' , record:data, records:data1, success:'Password Updated Successfully!', errors:''});
        })
});
});
});

//to delete password details
router.get('/delete/:id',checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id; 
    var passcatDelete = passModel.findByIdAndDelete(id);
    passcatDelete.exec(function(err){
        if (err) throw err;
        res.redirect('/view_all_password');
    })
});

//to display password details
router.get('/display/:id', checkLoginUser, function(req,res){
    var loginUser = localStorage.getItem('loginUser');
    var id1 = req.params.id;
    getAllPass.exec(function(err,data){
        data.forEach(function(a){
            if (a.id == id1){
                det1 = cryptr.decrypt(a.password_details);
                pro = a.project_name;
                res.render('pass_details',{title:'Your Details',loginUser:loginUser, passdet:det1, prodet:pro});
            }
        });
    });
});

module.exports = router;