
const mongoose = require('mongoose');
const {Schema} = mongoose;

const TeacherSchema = new Schema({
  name: String,
  email: {type:String, unique:true},
  password: String,
  staffid:{type:String, unique:true},
  year:String,
  ccourse:String,
  student: Boolean
});

const TeacherModel = mongoose.model('Teacher', TeacherSchema);

module.exports = TeacherModel;