let express = require('express');
let router = express.Router();
let Department = require('../models/Department');
let Ids = require('../models/IdsNext');// 引入模型

//-----------------------------------新增部门----------------------------------------
router.post('/add', (req,res) => {
  console.log('-------------添加部门-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'departmentId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let department = new Department({
      _id: data.sequence_value,
      name: cn.name,
      desc: cn.desc,
    })
    department.save((err, doc) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200'})
      }
    })
  })
})

//-----------------------------------岗位列表----------------------------------------
router.get('/list', (req, res) => {
  console.log('----------显示部门列表---------')
  let page = req.query.curPage;
  let rows = req.query.rows;
  let qc = {},
    name = req.query.name;
  let name_pattern = new RegExp("^.*"+name+".*$");
  if(name !== '' && name !== undefined){
    qc.name = name_pattern
  }
  let query = Department.find(qc);
  query.skip((page-1)*rows);
  query.limit(parseInt(rows));
  let result = query.exec();
  result.then((data)=>{
    // 获取总条数
    Department.find(qc,(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
    })
  })
});

// ----------------------------删除部门-------------------------
router.post('/delete', (req,res) =>{
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  console.log('-------------删除部门--------------');
  Department.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

// ----------------------------根据Id查询部门编辑-------------------------
router.get('/findById', (req, res) => {
  console.log('-----------------根据Id查询部门------------------')
  let query = {
    _id: req.query._id
  }
  Department.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })
});

// ----------------------------更新岗位-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新部门------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    name: cn.name,
    desc: cn.desc
  }
  Department.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
// -------------------------------查询所有部门名称------------------------
router.get('/findToAllDname',(req,res)=>{
  console.log('-----------------查询所有的部门名称------------------');
  Department.find({}, {_id:0 }).select('name').exec((err,rs)=>{
    let cv = []
    for (let i =0;i<rs.length;i++){
      cv.push({value:rs[i].name})
    }

    res.send({msg: 'sucess', state: '200', data: cv})
  })
})
module.exports = router;
