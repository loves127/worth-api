let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = new  Schema({
  _id: Number,
  name: String,
  updateTime: String,
  state: String,
  remark: String
})

module.exports = PostSchema
