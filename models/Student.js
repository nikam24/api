
const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {type:String, unique:true},
  password: String,
  register:{type:String, unique:true},
  year:String,
  branch:String,
  student: Boolean
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;