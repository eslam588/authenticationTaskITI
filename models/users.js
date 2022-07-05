const mongoose= require('mongoose');


// describe schema
const UserSchema =new mongoose.Schema({
    firstName: {type: 'string', required: true, minlength:5 , maxlength:20},
    lastName: {type: 'string', required: true, minlength:5 , maxlength:20,},
    email: {type: 'string', unique: true,match:/.+@.+\..+/},
    password: {type: 'string',minlength:5},
    token:{type: 'string'}
})





// create collection  with name => user

const UserModel = mongoose.model('user',UserSchema);
module.exports = UserModel;