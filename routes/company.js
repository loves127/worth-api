let express = require('express');
let router = express.Router();
let Company = require('../models/Company');
let Ids = require('../models/IdsNext');// 引入模型

//-----------------------------------新增公司----------------------------------------
router.post('/add', (req,res) => {
  console.log('-------------添加公司-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'companyId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let company = new Company({
      _id: data.sequence_value,
      name: cn.name,
      desc: cn.desc,
    })
    company.save((err, doc) => {
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
  console.log('----------显示公司列表---------')
  let page = req.query.curPage;
  let rows = req.query.rows;
  let qc = {},
    name = req.query.name;
  let name_pattern = new RegExp("^.*"+name+".*$");
  if(name !== '' && name !== undefined){
    qc.name = name_pattern
  }
  let query = Company.find(qc);
  query.skip((page-1)*rows);
  query.limit(parseInt(rows));
  let result = query.exec();
  result.then((data)=>{
    // 获取总条数
    Company.find(qc,(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
    })
  })
});

// ----------------------------删除公司-------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除公司--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };

  Company.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

// ----------------------------根据Id查询公司编辑-------------------------
router.get('/findById', (req, res) => {
  console.log('-----------------根据Id查询公司------------------')
  let query = {
    _id: req.query._id
  }
  Company.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })
});

// ----------------------------更新岗位-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新公司------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    name: cn.name,
    desc: cn.desc
  }
  Company.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
// -------------------------------查询所有公司名称------------------------
router.get('/findToAllCname',(req,res)=>{
  console.log('-----------------查询所有的公司名称------------------');
  Company.find({}, {_id:0 }).select('name').exec((err,rs)=>{
    let cv = []
    for (let i =0;i<rs.length;i++){
      cv.push({value:rs[i].name})
    }
    res.send({msg: 'sucess', state: '200', data: cv})
  })
})
module.exports = router;
