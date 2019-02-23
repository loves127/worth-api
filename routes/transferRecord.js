let express = require('express');
let router = express.Router();
let TransferRecord = require('../models/TransferRecord');
let Account = require('../models/Account');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------转账记录--------------------------
router.post('/add', (req, res) => {
  console.log('-------------添加转账记录-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'transferRecordId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let transferRecord = new TransferRecord({
      _id: data.sequence_value,
      outAccount: cn.outAccount,
      inAccount: cn.inAccount,
      transferDate: cn.transferDate,
      modifyDate: cn.modifyDate,
      transferAmount: cn.transferAmount,
      accountBalance: cn.accountBalance,
      remark: cn.remark
    });
    console.log(cn);

    let q1 = {
      accountNo: cn.outAccount
    };

    let q2 = {
      accountNo: cn.inAccount
    }
    // 1.查询转出用户余额
    let outAccount = Account.findOne(q1);
    // 2. 查询转入账户余额
    let inAccount = Account.findOne(q2);
    outAccount.then(data => {
      console.log(data)
      let param = {
        balance: data.balance - cn.transferAmount
      };
      // 2. 更新用户余额
      outAccount.findOneAndUpdate(q1, {$set: param}, (err, doc) => {
      });
      return {msg: '添加成功!', state: '200'}
    }).then(data => {
      inAccount.then(data => {
        let param = {
          balance: data.balance + parseInt(cn.transferAmount)
        };
        // 2. 更新用户余额
        inAccount.findOneAndUpdate(q2, {$set: param}, (err, doc) => {
        });
      }).then(data => {
        // 3.新增支出成功
        transferRecord.save((err) => {
          if (err) {
            res.send({msg: '添加失败!', state: '99'})
          } else {
            res.send({msg: '添加成功!', state: '200'})
          }
        });
      })
    })
  })
});

// --------------------------显示转账记录列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示转账记录列表---------')
  let cn = req.query;
  let page = cn.curPage;
  let rows = cn.rows;
  let qc = {},
    TransferRecordType = cn.TransferRecordType;
  let name_pattern = new RegExp("^.*" + TransferRecordType + ".*$");
  if (TransferRecordType !== '' && TransferRecordType !== undefined) {
    qc.TransferRecordType = name_pattern
  }
  let startDate = cn.rangeDate.split(',')[0];
  let endDate = cn.rangeDate.split(',')[1];
  if(startDate&& endDate){
    qc.transferDate = {"$gte": startDate, "$lte":endDate}
  }
  let query = TransferRecord.find(qc);
  query.skip((page - 1) * rows);
  query.limit(parseInt(rows));
  let result = query.sort({transferDate:-1}).exec();
  result.then((data) => {
    // 获取总条数
    TransferRecord.find(qc, (err, rs) => {
      res.send({msg: 'sucess', state: '200', data: data, total: rs.length})
    })
  })
});

// --------------------------查询转账记录-----------------------
router.get('/findById', (req, res) => {
  console.log('-----------------根据Id查询转账记录------------------')
  let query = {
    _id: req.query._id
  }
  TransferRecord.findById(query, (err, doc) => {
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新转账记录-------------------------
router.post('/update', (req, res) => {
  console.log('-----------------更新转账记录------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    outAccount: cn.outAccount,
    inAccount: cn.inAccount,
    modifyDate: cn.modifyDate,
    transferAmount: cn.transferAmount,
    accountBalance: cn.accountBalance,
    remark: cn.remark
  }
  TransferRecord.findOneAndUpdate(query, {$set: param}, (err, doc) => {
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除转账记录--------------------------
router.post('/delete', (req, res) => {
  console.log('-------------删除转账记录--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  TransferRecord.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

module.exports = router;
