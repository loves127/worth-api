let express = require('express');
let router = express.Router();
let IncomeType = require('../models/IncomeType');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------新增收入类型--------------------------
router.post('/add', (req,res)=>{
  console.log('-------------添加收入类型-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'incomeTypeId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let incomeType = new IncomeType({
      _id: data.sequence_value,
      incomeType: cn.incomeType,
      icon: cn.icon
    });
    incomeType.save((err) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200'})
      }
    })
  })
});

// --------------------------显示账户列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示收入类型列表---------')
  let cn = req.query;
  if(cn){
    let page = cn.curPage;
    let rows = cn.rows;
    let query = IncomeType.find({});
    query.skip((page-1)*rows);
    query.limit(parseInt(rows));
    let result = query.exec();
    result.then((data)=>{
      console.log(data)
      // 获取总条数
      IncomeType.find({},(err,rs)=>{
        res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
      })
    })
  }else{
    IncomeType.find({},(err,doc)=>{
      res.send({msg: 'sucess', state: '200', data: doc})
    })
  }

});

// --------------------------查询账户-----------------------
router.get('/findById', (req,res)=>{
  console.log('-----------------根据Id查询收入类型------------------')
  let query = {
    _id: req.query._id
  }
  IncomeType.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新账户-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新收入类型------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    incomeType: cn.incomeType,
    icon: cn.icon
  }
  IncomeType.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除账户--------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除账户--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  IncomeType.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

module.exports = router;
