let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let ExpenditureTypeSchema = new Schema({
  _id: Number, // 收入类型Id
  expenditureType: {type:String,default:''}, //收入类型
  icon:{type:String,default:''} // 图标
});

module.exports = ExpenditureTypeSchema;
