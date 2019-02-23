let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let ExpenditureSchema = new Schema({
  _id: Number, // 收入Id
  expenditureType: {type:String, default: ''}, //支出类型
  accountName: {type:String, default:''}, // 支出账户
  accountNo:{type:String,default:''}, // 账号
  money:{type:Number, default: 0}, // 支出金额
  recordDate:{type: Date,default:Date.now} , // 记录的日期
  modifyDate:{type:Date,default:Date.now}, // 最后的编辑日期
  tag:{type:String,default:'家'},
  remark: {type:String,default:''} // 支出备注
});

module.exports = ExpenditureSchema;
