/**
 * 预算
 * @type {mongoose.Schema}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let transferRecordSchema = new Schema({
  _id: Number, // 记录ID
  classfy:{type:String,default:''}, // 类别
  amount:{type:Number,default:0.00}, // 设置金额
  recordDate:{type:Date,default:Date.now}, // 记录日期
  modifyDate:{type:Date,default:Date.now}, // 最后的编辑日期
  balance:{type:Number,default:0.00}, // 金额
  exceeding:{type:Number,default:0.00},
  remark: {type:String,default:''}
});

module.exports = transferRecordSchema;
