let express = require('express');
let router = express.Router();
let PayType = require('../models/PayType');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------新增支付类型--------------------------
router.post('/add', (req,res)=>{
  console.log('-------------添加支付类型-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'payTypeId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let payType = new PayType({
      _id: data.sequence_value,
      payType: cn.payType,
    })
    payType.save((err) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200'})
      }
    })
  })
});

// --------------------------显示支付列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示支付类型列表---------')
  let cn = req.query;
  if(!cn){
    let page = cn.curPage;
    let rows = cn.rows;
    let query = PayType.find({});
    query.skip((page-1)*rows);
    query.limit(parseInt(rows));
    let result = query.exec();
    result.then((data)=>{
      // 获取总条数
      PayType.find({},(err,rs)=>{
        res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
      })
    })
  }else{
    PayType.find({},(err,doc)=>{
      res.send({msg: 'sucess', state: '200', data: doc})
    })
  }

});

// --------------------------查询支付类型-----------------------
router.get('/findById', (req,res)=>{
  console.log('-----------------根据Id查询收入类型------------------')
  let query = {
    _id: req.query._id
  }
  PayType.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新支付类型-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新支付类型------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    payType: cn.payType,
  }
  PayType.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除支付类型--------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除支付类型--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  PayType.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

module.exports = router;
