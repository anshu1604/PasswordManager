//  to inculde mongoose
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//connect to the database
mongoose.connect('mongodb+srv://anshi123:anshi123@pmscluster.7iq04.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true});

//to store connection
var conn = mongoose.Collection;

//to create schema
var passSchema = new mongoose.Schema({
    password_category:{
        type: String,
        required: true,
    },
    project_name:{
        type: String,
        required: true
    },
    password_details:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    username:{
        type: String,
        required: true
    }
});
passSchema.plugin(mongoosePaginate)
//to create model of schema
var passModel = mongoose.model('password_details', passSchema);

//export the model
module.exports = passModel;