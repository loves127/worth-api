let express = require('express');
let router = express.Router();
let Expenditure = require('../models/Expenditure');

// const setQuery = (cn) => {
//   let qc = {},
//     expenditureType = cn.expenditureType,
//     accountNo = cn.accountNo,
//     accountName = cn.accountName;
//   let name_pattern = new RegExp("^.*" + expenditureType + ".*$");
//   if (expenditureType !== '' && expenditureType !== undefined) {
//     qc.expenditureType = name_pattern
//   }
//   if (accountNo !== '' && accountNo !== undefined) {
//     qc.accountNo = accountNo
//   }
//   if (accountName !== '' && accountName !== undefined) {
//     qc.accountName = accountName
//   }
//   if (cn.tag !== '' && cn.tag !== undefined) {
//     qc.tag = cn.tag;
//   }
//   if (cn.rangeDate === ',' || cn.rangeDate === undefined || cn.rangeDate === '') {
//   } else {
//     let startDate = new Date(cn.rangeDate.split(',')[0]);
//     let endDate = new Date(cn.rangeDate.split(',')[1]);
//     qc.recordDate = {"$gte": startDate, "$lte": endDate}
//   }
//   return qc;
// };

// ---------------------------分析页面charts数据----------------------
router.get('/queryToCharts',(req,res)=>{
  console.log('---------------按条件查询统计分析饼图数据---------------');
  // let cn = req.query;
  // let qc = setQuery(cn);
  let date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  /**
   * 默认查询本月和上一个
   * @type {Date}
   */
 ;
  let currStarDate = new Date(date.setDate(1));
  let currEndDate=new Date(y,m+1,1);
  let preStartDate =new Date((new Date(date.setMonth(m-1))).setDate(1));
  let preEndDate = new Date(date.getFullYear(),m,1);
  let qc = {recordDate:{"$gte": currStarDate, "$lte": currEndDate}};
  let qc1 =  {recordDate:{"$gte": preStartDate, "$lte": preEndDate}};
  let rs1 = Expenditure.aggregate().match(qc).group({
    _id: '$expenditureType',
    sumMoney: {$sum: '$money'}
  }).project('sumMoney').sort({sumMoney: -1}).exec();
  // ---------------------计算上月------------------------------
  let rs2 = Expenditure.aggregate().match(qc1).group({
    _id: '$expenditureType',
    sumMoney: {$sum: '$money'}
  }).project('sumMoney').sort({sumMoney: -1}).exec();
  //-----------------------计算指定日期内的总额----------------------
  let rs3 = Expenditure.aggregate().match(qc).sort({recordDate: -1}).group({
    _id: '$recordDate',
    sumMoney: {$sum: '$money'},
  }).project('sumMoney').exec();
  rs1.then(d1 => {
    rs2.then(d2 => {
      rs3.then(d3 => {
        let rate = [];
        for (let i=0;i<d1.length;i++){
          for(let j=0;j<d2.length;j++){
            if(d2[j]._id === d1[i]._id){
              rate.push({_id: d2[j]._id, rate:(d1[i].sumMoney-d2[j].sumMoney)/d2[j].sumMoney.toFixed(2)})
              break;
            }
          }
        }
       res.send({msg: 'sucess', state: '200', pieData: d1, rate: rate, lineData: d3})
      })
    })
  })
});

module.exports = router;
