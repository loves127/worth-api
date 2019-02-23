let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let PayTypeSchema = new Schema({
  _id: Number, // 收入类型Id
  payType: String //收入类型
});

module.exports = PayTypeSchema;
