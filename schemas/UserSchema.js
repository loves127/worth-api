let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  _id: Number,
  name: String,
  sex: String,
  startDate: String,
  tellphone: String,
  eMail: String,
  address: String,
  post: String,
  department:String,
  company: String,
  remark: String
})

module.exports = UserSchema
