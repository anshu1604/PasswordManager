//  to inculde mongoose
var mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb+srv://anshi123:anshi123@pmscluster.7iq04.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser:true, useFindAndModify:false , useCreateIndex:true, useUnifiedTopology:true});

//to store connection
var conn = mongoose.Collection;

//to create schema
var userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
        index:{
            unique: true
        }
    },
    username:{
        type: String,
        required: true,
        index:{
            unique: true
        }
    },
    email:{
        type: String,
        required: true,
        index:{
            unique: true
        }
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

//to create model of schema
var userModel = mongoose.model('users', userSchema);

//export the model
module.exports = userModel;