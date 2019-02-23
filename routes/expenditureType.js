let express = require('express');
let router = express.Router();
let ExpenditureType = require('../models/ExpenditureType');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------新增支出类型--------------------------
router.post('/add', (req,res)=>{
  console.log('-------------添加支出类型-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'expenditureTypeId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let expenditureType = new ExpenditureType({
      _id: data.sequence_value,
      expenditureType: cn.expenditureType,
      icon: cn.icon
    })
    expenditureType.save((err) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200'})
      }
    })
  })
});

// --------------------------显示支出列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示支出类型列表---------')
  let cn = req.query;
  if(cn){
    let page = cn.curPage;
    let rows = cn.rows;
    let query = ExpenditureType.find({});
    query.skip((page-1)*rows);
    query.limit(parseInt(rows));
    let result = query.exec();
    result.then((data)=>{
      // 获取总条数
      ExpenditureType.find({},(err,rs)=>{
        res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
      })
    })
  } else {
    // 获取总条数
    ExpenditureType.find({},(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: rs})
    })
  }

});

// --------------------------查询支出类型-----------------------
router.get('/findById', (req,res)=>{
  console.log('-----------------根据Id查询支出类型------------------')
  let query = {
    _id: req.query._id
  }
  ExpenditureType.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新支出类型-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新支出类型------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    expenditureType: cn.expenditureType,
    icon: cn.icon
  }
  ExpenditureType.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除支出类型--------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除支出类型--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  ExpenditureType.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});
module.exports = router;
