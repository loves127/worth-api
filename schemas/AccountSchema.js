/**
 *  账户
 * @type {mongoose.Schema}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let AccountSchema = new Schema({
  _id: Number, // 账户ID
  accountName: String, // 账户名称
  // bankName:String, // 开户银行
  accountNo:String, //账号
  initMoney: {type:Number,default:0}, //初始金额
  balance: {type:Number,default:0}, // 余额
  remark: String // 备注
});

module.exports = AccountSchema;
