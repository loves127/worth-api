let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let IncomeSchema = new Schema({
  _id: Number, // 收入Id
  incomeType: {type:String,default:''}, //收入类型
  icon:{type:String,default:''}, //图标
  accountName: {type:String,default:''}, // 账户名称
  accountNo:{type:String,default:''}, // 账号
  money:{type:Number,default:0.00}, // 收入金额
  recordDate:{type:Date, default:Date.now}, // 记录的日期
  modifyDate:{type:Date,default:Date.now}, // 最后的编辑日期
  remark: {type:String, default:''} // 收入备注
});

module.exports = IncomeSchema;
