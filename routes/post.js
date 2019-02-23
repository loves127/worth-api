let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let Ids = require('../models/IdsNext');// 引入模型

//-----------------------------------新增岗位----------------------------------------
router.post('/add', (req,res) => {
  console.log('-------------添加岗位-----------------------')
  let cn = req.body;
  let id = Ids.findByIdAndUpdate(
    {_id: 'postId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let post = new Post({
      _id: data.sequence_value,
      name: cn.name,
      updateTime: cn.updateTime,
      state: cn.state,
      remark: cn.remark
    })
    post.save((err, doc) => {
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
  console.log('----------显示岗位列表---------')
  let cn = req.query;
  let page = cn.curPage;
  let rows = cn.rows;
  let qc = {},
    name = cn.name,
    state = cn.state;
  let name_pattern = new RegExp("^.*"+name+".*$");
  let state_pattern = new RegExp("^.*"+state+".*$");
  if(name !== '' && name !== undefined){
    qc.name = name_pattern
  }
  if(state !=='' && state !== undefined){
    qc.state = state_pattern
  }
  let query = Post.find(qc);
  query.skip((page-1)*rows);
  query.limit(parseInt(rows));
  let result = query.exec();
  result.then((data)=>{
    // 获取总条数
    Post.find(qc,(err,rs)=>{
      res.send({msg: 'sucess', state: '200', data: data,total:rs.length})
    })
  })
});

// ------------------------------删除选中数据---------------------------
router.post('/delete', (req,res) =>{
  console.log('-------------删除岗位--------------');
  let ids = req.body._ids.split(',');
  let query = {
    _id: ids
  };
  Post.deleteMany(query, (err, doc) => {
    if (err) {
      res.send({msg: '删除失败', state: '99'})
    } else {
      res.send({msg: '删除成功', state: '200', data: doc})
    }
  })
});

// ----------------------------根据Id查询岗位编辑-------------------------
router.get('/findById', (req, res) => {
  console.log('-----------------根据Id查询岗位------------------')
  let query = {
    _id: req.query._id
  }
  Post.findById(query, (err,doc)=>{
    res.send({msg: 'sucess', state: '200', data: doc})
  })
});

// ----------------------------更新岗位-------------------------
router.post('/update',(req,res) =>{
  console.log('-----------------更新岗位------------------');
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    name: cn.name,
    state: cn.state,
    updateTime: cn.updateTime,
    remark: cn.remark
  }
  Post.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});

// ----------------------------根据Id更新岗位状态-----------------------------
router.post('/findByIdAndUpdate', (req,res)=>{
  let cn = req.body;
  let query = {
    _id: req.body._id
  }
  let param = {
    state: cn.state
  };
  Post.findByIdAndUpdate(query,param,(err,doc)=>{
    res.send({msg: 'sucess', state: '200'})
  })
});
// -------------------------查询所有的岗位名称----------------------------------
router.get('/findToAllPname',(req,res)=>{
  console.log('-----------------查询所有的岗位名称------------------');
  Post.find({}, {_id:0 }).select('name').exec((err,rs)=>{
    let cv = []
    for (let i =0;i<rs.length;i++){
      cv.push({value:rs[i].name})
    }
    res.send({msg: 'sucess', state: '200', data: cv})
  })
});

module.exports = router;
