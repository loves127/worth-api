let express = require('express');
let router = express.Router();
let Budget = require('../models/Budget');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------预算方案记录--------------------------
router.post('/add', (req,res)=>{
  console.log('-------------添加预算方案记录-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'budgetId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let budget = new Budget({
      _id: data.sequence_value,
      classfy: cn.classfy,
      amount: cn.amount,
      recordDate: cn.recordDate,
      modifyDate:cn.modifyDate,
      balance: cn.amount,
      remark:cn.remark
    });
    budget.save((err) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200'})
      }
    })
  })
});

// --------------------------显示预算方案记录列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示预算方案记录列表---------')
  let cn = req.query;
  let page = cn.curPage;
  let rows = cn.rows;
  let qc = {},
    BudgetType = cn.BudgetType;
  let name_pattern = new RegExp("^.*"+BudgetType+".*$");
  if(BudgetType !== '' && BudgetType !== undefined){
    qc.BudgetType = name_pattern
  }
  let startDate = cn.rangeDate.split(',')[0];
  let endDate = cn.rangeDate.split(',')[1];
  if (startDate && endDate) {
    qc.recordDate = {"$gte": startDate, "$lte": endDate}
  }
  let query = Budget.find(qc);
  query.skip((page-1)*rows);
  query.limit(parseInt(rows));
  let result = query.exec();
  result.then((data)=>{
    if(data.length>0){
      if(data[0].balance<0){
        data[0].exceeding = 0-data[0].balance;
        data[0].balance = 0;
      }
    }
    // 获取总条数
    Budget.find(qc,(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
    })
  })
});

// --------------------------查询预算方案记录-----------------------
router.get('/findById', (req,res)=>{
  console.log('-----------------根据Id查询预算方案记录------------------')
  let query = {
    _id: req.query._id
  }
  Budget.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新预算方案记录-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新预算方案记录------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    classfy: cn.classfy,
    amount: cn.amount,
    modifyDate: cn.modifyDate,
    balance: cn.balance,
    remark:cn.remark
  }
  Budget.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除预算方案记录--------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除预算方案记录--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  Budget.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

module.exports = router;
