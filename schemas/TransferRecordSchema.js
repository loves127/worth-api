let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let BudgetSchema = new Schema({
  _id: Number, // 记录ID
  outAccount:{type:String,default:''}, // 转出账户
  inAccount:{type:String,default:''}, // 转入账户
  transferDate:{type: Date,default:Date.now}, // 转账日期
  modifyDate:{type:Date,default:Date.now}, // 最后的编辑日期
  transferAmount:{type:Number,default:0.00}, // 转账金额
  accountBalance:{type:Number, default:0.00}, // 账户余额
  remark: {type:String, default:''}
});

module.exports = BudgetSchema;
