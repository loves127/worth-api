let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CompanySchema = new Schema({
  _id: Number, // 公司ID
  name: String, // 公司名称
  desc:String // 公司简称
})

module.exports = CompanySchema
