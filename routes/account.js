let express = require('express');
let router = express.Router();
let Account = require('../models/Account');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------新增账户--------------------------
router.post('/add', (req,res)=>{
  console.log('-------------添加账户-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'accountId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let account = new Account({
      _id: data.sequence_value,
      accountName: cn.accountName,
      // bankName: cn.bankName,
      accountNo: cn.accountNo,
      initMoney: cn.initMoney,
      balance: cn.initMoney,
      remark: cn.remark
    })
    account.save((err) => {
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
  console.log('----------显示账户列表---------')
  let cn = req.query;
  if(cn){
    let page = cn.curPage;
    let rows = cn.rows;
    let qc = {},
      accountName = cn.accountName,
      accountNo = cn.accountNo;
    let name_pattern = new RegExp("^.*"+accountName+".*$");
    let no_pattern = new RegExp("^.*"+accountNo+".*$");
    if(accountName !== '' && accountName !== undefined){
      qc.accountName = name_pattern
    }
    if(accountNo !== '' && accountNo !== undefined){
      qc.accountNo = no_pattern
    }
    let query = Account.find(qc);
    query.skip((page-1)*rows);
    query.limit(parseInt(rows));
    let result = query.exec();
    result.then((data)=>{
      // 获取总条数
      Account.find(qc,(err,rs)=>{
        res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
      })
    })
  }else{
    Account.find({},(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: rs})
    })
  }

});

// --------------------------查询账户-----------------------
router.get('/findById', (req,res)=>{
  console.log('-----------------根据Id查询账户------------------')
  let query = {
    _id: req.query._id
  }
  Account.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })
});

// --------------------------更新账户-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新账户------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    accountName: cn.accountName,
    // bankName: cn.bankName,
    accountNo: cn.accountNo,
    // initMoney: cn.initMoney,
    // balance: cn.balance,
    remark: cn.remark
  }
  Account.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
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
  Account.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

module.exports = router;
