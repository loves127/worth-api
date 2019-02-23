require('../config/mongoose.js');

let Test = require('../models/Manager')
// 查询
// Test.find({},function (err, docs) {
//   console.log(docs)
//   process.exit()
// })

// 增加
let User = new Test();
User.username = 'admin';
User.password = 'admin';
User.save((err, docs)=>{
  console.log('数据添加成功!')
})

// 查询一条数据
// Test.findOne({ "username" : "zhansgan"}, (err,doc) => {
//    console.log(doc)
// })


