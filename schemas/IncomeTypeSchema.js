let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let IncomeTypeSchema = new Schema({
  _id: Number, // 收入类型Id
  incomeType: {type:String,default:''}, //收入类型
  icon:{type:String,default:''} // 图标
});

module.exports = IncomeTypeSchema;
