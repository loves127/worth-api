let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DepartmentSchema = new Schema({
  _id: Number, // 部门ID
  name: String, // 部门名称
  desc:String // 部门简称
})

module.exports = DepartmentSchema
