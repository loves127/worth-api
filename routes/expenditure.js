let express = require('express');
let router = express.Router();
let Expenditure = require('../models/Expenditure');
let Account = require('../models/Account');
let Budget = require('../models/Budget');
let Ids = require('../models/IdsNext');// 引入模型

// --------------------------支出--------------------------
router.post('/add', (req, res) => {
  console.log('-------------添加支出-----------------------');
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'expenditureId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let expenditure = new Expenditure({
      _id: data.sequence_value,
      expenditureType: cn.expenditureType,
      accountName: cn.accountName,
      accountNo: cn.accountNo,
      money: cn.money,
      recordDate: cn.recordDate,
      modifyDate: cn.modifyDate,
      tag: cn.tag,
      remark: cn.remark
    });
    let q1 = {
      accountNo: cn.accountNo
    };

    // 1.查询用户余额
    let account = Account.findOne(q1);

    account.then(data => {
      /**
       *  判断用户余额是否充足
       *  [充足:提示新增支出记录成功，不充足:提示用户账户余额不足请更换账户或者充值]
       * @type {{balance: number}}
       */
      let param = {
        balance: data.balance - cn.money
      };
      // 2. 更新用户余额
      Account.findOneAndUpdate(q1, {$set: param}, (err, doc) => {
      });
    }).then(data => {
      let q2 = {
        classfy: cn.expenditureType
      }
      // 1.查询预算余额
      let budget = Budget.findOne(q2);
      /**
       *  判断设置的预算是否充足
       *  [充足:提示新增支出记录成功，不充足:提示用户设置的预算已经超额]
       * @type {{balance: number}}
       */
      budget.then(data => {
        let param = {
          balance: data.balance - cn.money
        };
        Budget.findOneAndUpdate(q2, {$set: param}, (err, doc) => {
        });
      })
    }).then(data => {
      // 3.新增支出成功
      expenditure.save((err) => {
        if (err) {
          res.send({msg: '添加失败!', state: '99'})
        } else {
          res.send({msg: '添加成功!', state: '200'})
        }
      });
    })
  })
});

// --------------------------显示支出列表-------------------------
router.get('/list', (req, res) => {
  console.log('----------显示支出列表---------');
  let cn = req.query;
  let page = cn.curPage;
  let rows = cn.rows;
  let qc = {},
    expenditureType = cn.expenditureType,
    accountNo = cn.accountNo,
    accountName = cn.accountName;

  let name_pattern = new RegExp("^.*" + expenditureType + ".*$");
  if (expenditureType !== '' && expenditureType !== undefined) {
    qc.expenditureType = name_pattern
  }
  if (accountNo !== '' && accountNo !== undefined) {
    qc.accountNo = accountNo
  }
  if (accountName !== '' && accountName !== undefined) {
    qc.accountName = accountName
  }
  let startDate = cn.rangeDate.split(',')[0];
  let endDate = cn.rangeDate.split(',')[1];
  if (startDate && endDate) {
    qc.recordDate = {"$gte": startDate, "$lte": endDate}
  }
  if (cn.tag !== '' && cn.tag !== undefined) {
    qc.tag = cn.tag;
  }
  let query = Expenditure.find(qc);
  query.skip((page - 1) * rows);
  query.limit(parseInt(rows));
  let result = query.sort({recordDate: -1}).exec();
  result.then((data) => {
    // 获取总条数
    Expenditure.find(qc, (err, rs) => {
      res.send({msg: 'sucess', state: '200', data: data, total: rs.length})
    })
  })
});

// --------------------------查询支出-----------------------
router.get('/findById', (req, res) => {
  console.log('-----------------根据Id查询支出------------------')
  let query = {
    _id: req.query._id
  }
  Expenditure.findById(query, (err, doc) => {
    res.send({msg: 'sucess', state: '200', data: doc})
  })

});

// --------------------------更新支出-------------------------
router.post('/update', (req, res) => {
  console.log('-----------------更新支出------------------');
  let cn = req.body;
  let query = {

    _id: req.body._id
  };
  let param = {
    expenditureType: cn.expenditureType,
    accountName: cn.accountName,
    accountNo: cn.accountNo,
    money: cn.money,
    modifyDate: cn.modifyDate,
    tag: cn.tag,
    remark: cn.remark
  };
  Expenditure.findOneAndUpdate(query, {$set: param}, (err, doc) => {
    res.send({msg: 'sucess', state: '200'})
  })
});
//---------------------------删除支出--------------------------
router.post('/delete', (req, res) => {
  console.log('-------------删除支出--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  /**
   * 删除支出记录，还原余额
   * @type {number | * | T}
   */
  Expenditure.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

const setQuery = (cn) => {
  let qc = {},
    expenditureType = cn.expenditureType,
    accountNo = cn.accountNo,
    accountName = cn.accountName;
  let name_pattern = new RegExp("^.*" + expenditureType + ".*$");
  if (expenditureType !== '' && expenditureType !== undefined) {
    qc.expenditureType = name_pattern
  }
  if (accountNo !== '' && accountNo !== undefined) {
    qc.accountNo = accountNo
  }
  if (accountName !== '' && accountName !== undefined) {
    qc.accountName = accountName
  }
  if (cn.tag !== '' && cn.tag !== undefined) {
    qc.tag = cn.tag;
  }
  if (cn.rangeDate === ',' || cn.rangeDate === undefined || cn.rangeDate === '') {
  } else {
    let startDate = new Date(cn.rangeDate.split(',')[0]);
    let endDate = new Date(cn.rangeDate.split(',')[1]);
    qc.recordDate = {"$gte": startDate, "$lte": endDate}
  }
  return qc;
};


// -------------------------按条件查询统计分析饼图数据--------------------
router.get('/queryToPie', (req, res) => {
  console.log('---------------按条件查询统计分析饼图数据---------------');
  let cn = req.query;
  let qc = setQuery(cn);
  let date = new Date();
  /**
   * 默认查询本月和上一个
   * @type {Date}
   */
  let starDate = new Date(date.setDate(1));
  let endDate=new Date(date.getFullYear(),date.getMonth()+1,1);
  if(Object.keys(qc).length ===0){
    qc = Object.assign({recordDate:{"$gte": starDate, "$lte": endDate}},qc)
  }
  console.log(qc)
  let rs1 = Expenditure.aggregate().match(qc).group({
    _id: '$expenditureType',
    sumMoney: {$sum: '$money'}
  }).project('sumMoney').sort({sumMoney: -1}).exec();
  // ---------------------计算总额------------------------------
  let rs2 = Expenditure.aggregate().match(qc).group({
    _id: null,
    totalMoney: {$sum: '$money'}
  }).project('totalMoney').exec();
  //-----------------------计算指定日期内的总额----------------------
  let rs3 = Expenditure.aggregate().match(qc).sort({recordDate: -1}).group({
    _id: '$recordDate',
    sumMoney: {$sum: '$money'},
  }).project('sumMoney').exec();
  rs1.then(d1 => {
    rs2.then(d2 => {
      rs3.then(d3 => {
        res.send({msg: 'sucess', state: '200', pieData: d1, total: d2, lineData: d3})
      })
    })
  })
});

//------------------计算消费明细---------------------
router.get('/queryExDetail', (req, res) => {
  console.log('---------------------------------计算消费明细------------------------------------');
  let cn = req.query;
  let qc = setQuery(cn);
  // ---------------------计算总额------------------------------
  let rs1 = Expenditure.aggregate().match(qc).group({
    _id: null,
    totalMoney: {$sum: '$money'}
  }).project('totalMoney').exec();
  // ----------------计算平均消费-------------------------------
  let rs2 = Expenditure.aggregate().match(qc).group({
    _id: '$recordDate',
    sumMoney: {$sum: '$money'}
  }).project('sumMoney').exec();
  rs1.then(d1 => {
    rs2.then(d2 => {
      let moneryAry = d2.map(item => {
        return item.sumMoney
      });
      let avgMoney = 0;
      if (d1.length > 0 && d2.length > 0) {
        avgMoney = d1[0].totalMoney / d2.length;
      }
      if (moneryAry.length === 0) {
        moneryAry = [0]
      }
      let maxEx = Math.max.apply(null, moneryAry);
      let minEx = Math.min.apply(null, moneryAry);
      res.send({msg: 'sucess', state: '200', avgEx: avgMoney, maxEx: maxEx, minEx: minEx})
    })
  })
});

module.exports = router;
