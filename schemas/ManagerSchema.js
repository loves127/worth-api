let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let managerSchema = new Schema({
  username:String,
  password:String
});

module.exports = managerSchema;
