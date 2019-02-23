let express = require('express');
let router = express.Router();
let Manager = require('../models/Manager');// 引入模型

router.get('/', (req,res,next) =>{
  res.render('index');
})
// ------------------------登录-----------------------------
router.post('/login',(req,res,next)=>{
  let username = req.body.username;
  let password = req.body.password;
  if(username == null || password == null) {
    res.send({msg:'用户名或密码不能为空',state:'91'})
    return
  }
  console.log('--------用户登录操作--------')
  Manager.findOne({ "username" : username}, (err, doc) => {
    if (doc == null){
      res.send({msg:'用户名不正确',state:'91'})
      return
    }
    if(password === doc.password){
      res.send({msg:'登录成功!',state:'200'})
    } else {
      res.send({msg:'密码不正确!',state:'99'})
    }
  })
});
// --------------------------注册---------------------------------------
router.post('/register', (req, res, next) => {
  let manager = new Manager({
    username: req.body.username,
    password: req.body.password
  })
  console.log('-------注册用户操作-------')
  manager.save((err,doc)=>{
    if(err){
      res.send({msg:'注册失败!',state:'99'})
    } else {
      res.send({msg:'注册成功!',state:'200'})
    }
  })
})

module.exports = router;
