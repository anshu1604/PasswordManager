//  to inculde mongoose
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

//connect to the database
mongoose.connect('mongodb+srv://anshi123:anshi123@pmscluster.7iq04.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true});

//to store connection
var conn = mongoose.Collection;

//to create schema
var passcatSchema = new mongoose.Schema({
    password_category:{
        type: String,
        required: true,
        index:{
            unique: true
        }
    },
    username:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

//to create model of schema
passcatSchema.plugin(mongoosePaginate);
var passCatModel = mongoose.model('password_categories', passcatSchema);

//export the model
module.exports = passCatModel;