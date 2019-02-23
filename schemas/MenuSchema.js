let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//创建Schema
let managerSchema = new Schema({
  id:{type:Number}, // 菜单id
  parentId:{type:String}, // 父级菜单id
  name:{type: String,default:'新菜单'}, // 菜单名称、
  url:{type: String, default:'/'}, // 菜单连接
  sort:{type:Number}, // 菜单排序
  icon:{type:String}, // 菜单图标
  visible:{type:Boolean,default: false}, // 菜单图标是否可见
  remark:{type: String} // 菜单备注
});

module.exports = managerSchema;
