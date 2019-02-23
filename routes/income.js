let express = require('express');
let router = express.Router();
let Income = require('../models/Income');
let Account = require('../models/Account');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------收入--------------------------
router.post('/add', (req,res)=>{
  console.log('-------------添加收入-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'incomeId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let income = new Income({
      _id: data.sequence_value,
      incomeType: cn.incomeType,
      icon:cn.icon,
      accountName: cn.accountName,
      accountNo: cn.accountNo,
      money: cn.money,
      recordDate: cn.recordDate,
      modifyDate: cn.modifyDate,
      remark:cn.remark
    });

    let query = {
      accountNo: cn.accountNo
    };
    // 1.查询用户余额
    let account = Account.findOne(query);
    account.then(data => {
      let param = {
        balance: data.balance + parseInt(cn.money)
      };
      // 2. 更新用户余额
      Account.findOneAndUpdate(query, {$set: param}, (err, doc) => {
      });
      return {msg: '添加成功!', state: '200'}
    }).then(data => {
      // 3.新增支出成功
      income.save((err) => {
        if (err) {
          res.send({msg: '添加失败!', state: '99'})
        } else {
          res.send({msg: '添加成功!', state: '200'})
        }
      });
    })



  })
});

// --------------------------显示收入列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示收入列表---------')
  let cn = req.query;
  console.log(cn)
  let page = cn.curPage;
  let rows = cn.rows;
  let qc = {},
    incomeType = cn.incomeType,
    accountNo = cn.accountNo,
    accountName = cn.accountName;
  let name_pattern = new RegExp("^.*"+incomeType+".*$");
  // let name_pattern1 = new RegExp("^.*" + accountNo + ".*$");
  // let name_pattern2 = new RegExp("^.*" + accountName + ".*$");
  if(incomeType !== '' && incomeType !== undefined){
    qc.incomeType = name_pattern
  }
  if (accountNo !== '' && accountNo !== undefined) {
    qc.accountNo = accountNo
  }
  if (accountName !== '' && accountName !== undefined) {
    qc.accountName = accountName
  }
  let startDate = cn.rangeDate.split(',')[0];
  let endDate = cn.rangeDate.split(',')[1];
  if(startDate&& endDate){
    qc.recordDate = {"$gte": startDate, "$lte":endDate}
  }
  let query = Income.find(qc);
  query.skip((page-1)*rows);
  query.limit(parseInt(rows));
  let result = query.exec();
  result.then((data)=>{
    // 获取总条数
    Income.find(qc,(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
    })
  })
});

// --------------------------查询收入-----------------------
router.get('/findById', (req,res)=>{
  console.log('-----------------根据Id查询收入------------------')
  let query = {
    _id: req.query._id
  }
  Income.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新收入-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新收入------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    incomeType: cn.incomeType,
    icon:cn.icon,
    accountName: cn.accountName,
    accountNo: cn.accountNo,
    money: cn.money,
    modifyDate: cn.modifyDate,
    remark:cn.remark
  }
  Income.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除收入--------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除收入--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  Income.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

module.exports = router;
