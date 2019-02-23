let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let IdesNextSchema = new Schema({
  _id: String,
  sequence_value:Number
});

module.exports = IdesNextSchema;
