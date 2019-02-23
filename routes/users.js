let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Department = require('../models/Department');
let Company = require('../models/Company');
let Post = require('../models/Post');
let Ids = require('../models/IdsNext');// 引入模型
// --------------------------------新增用户-----------------------------
router.post('/add', function (req, res) {
  console.log('-------------添加用户-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'userId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let user = new User({
      _id: data.sequence_value,
      name: cn.name,
      sex: cn.sex,
      startDate: cn.startDate,
      tellphone: cn.tellphone,
      eMail: cn.eMail,
      address: cn.address,
      post: cn.post,
      department: cn.department,
      company: cn.company,
      remark: cn.remark
    })
    user.save((err, doc) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200'})
      }
    })
  })
});

// --------------------------根据Id查询用户编辑-----------------------
router.get('/findById', (req, res) => {
  console.log('-----------------根据Id查询用户------------------')
  let query = {
    _id: req.query._id
  }
  User.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })
});
//--------------------- 更新用户-----------------------------
router.post('/update',(req,res) =>{
   console.log('-----------------更新用户------------------');
  let cn = req.body;
   let query = {
     _id: req.body._id
   }
   let param = {
     name: cn.name,
     sex: cn.sex,
     startDate: cn.startDate,
     tellphone: cn.tellphone,
     eMail: cn.eMail,
     address: cn.address,
     post: cn.post,
     company: cn.company,
     department: cn.department,
     remark: cn.remark
   }
   User.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
     res.send({msg: 'sucess', state: '200'})
   })
});

// -----------------显示用户列表【根据条件】------------------------------
router.get('/list', (req, res, next) => {
  console.log('----------显示用户列表---------')
  let cn = req.query;
  let page = cn.curPage;
  let rows = cn.rows;
  let qc = {},
    name = cn.name,
    sex=cn.sex,
    company = cn.company,
    department = cn.department,
    post = cn.post;

  let name_pattern = new RegExp("^.*"+name+".*$");
  let post_pattern = new RegExp("^.*"+post+".*$");
  let department_pattern = new RegExp("^.*"+department+".*$");
  let company_pattern = new RegExp("^.*"+company+".*$");
  if(name !== '' && name !== undefined){
    qc.name = name_pattern
  }
  if(sex !== '' && sex !== undefined){
    qc.sex = sex
  }
  if(company !=='' && company !== undefined){
    qc.company = company_pattern
  }
  if(post !== '' && post !== undefined){
    qc.post = post_pattern
  }
  if(department !== '' && department !== undefined){
    qc.department = department_pattern
  }
  let query = User.find(qc);
  query.skip((page-1)*rows);
  query.limit(parseInt(rows));
  let result = query.exec();
  result.then((data)=>{
    console.log(data)
    // 获取总条数
    User.find(qc,(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
    })
  })
});

// -----------------------根据条件删除一个用户--------------------------
router.post('/delete', (req, res) => {
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  console.log('-------------删除用户--------------');
  User.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});
// --------------------------查询岗位列表-------------------------------
router.get('/postList', (req, res) => {
  console.log('----------显示岗位列表---------')
  Post.find({},(err,rs)=>{
    res.send({msg: 'success', state: '200', data: rs})
  })
});
//---------------------- 查询部门列表----------------------------
router.get('/departmentList', (req, res) => {
  console.log('----------显示部门列表---------')
  Department.find({},(err,rs)=>{
    res.send({msg: 'success', state: '200', data: rs})
  })
});
// -----------------------查询公司列表------------------------
router.get('/companyList', (req, res) => {
  console.log('----------显示公司列表---------')
  Company.find({},(err,rs)=>{
    res.send({msg: 'success', state: '200', data: rs})
  })
});
module.exports = router;

