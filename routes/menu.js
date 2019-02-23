let express = require('express');
let router = express.Router();
let Menu = require('../models/Menu');
let Ids = require('../models/IdsNext');// 引入模型
// ---------------------增加菜单节点-----------------------------
router.post('/tree/add', (req,res)=>{
  console.log(' ---------------------增加菜单节点-----------------------------');
  let id = Ids.findByIdAndUpdate(
    {_id: 'menuId'},
    {$inc: {sequence_value: 1}});
  id.then(data => {
    let rs = {
      id: data.sequence_value,
      parentId: req.body.parentId,
      name: req.body.name,
      url:req.body.url,
      sort:req.body.sort,
      icon:req.body.icon,
      visible: req.body.visible,
      remark: req.body.remark
    }
    let menu = new Menu(rs);
    menu.save((err,rs) => {
      if (err) {
        res.send({msg: '添加失败!', state: '99'})
      } else {
        res.send({msg: '添加成功!', state: '200',data: rs})
      }
    })
  })
});
// ----------------编辑菜单节点-------------
router.post('/tree/update', function (req, res) {
  console.log('----------------------------编辑菜单-------------------------------')
  let query = {
    id: req.body.id
  }
  console.log(req.body)
  let param = {
    id:req.body.id,
    parentId: req.body.parentId,
    name: req.body.name,
    url:req.body.url,
    sort:req.body.sort,
    icon:req.body.icon,
    visible: req.body.visible,
    remark: req.body.remark
  };
  Menu.findOneAndUpdate(query,{ $set: param},(err,doc)=>{
    res.send({msg: 'sucess', state: '200',data:param})
  })
});

// --------------------显示菜单列表-----------------
router.get('/tree/list', function (req, res) {
  console.log('--------------------显示菜单列表-----------------')
  const id = req.query.id || '';
  console.log(id)
  let query = {
    parentId:id
  }
  Menu.find(query,(err,rs)=>{
    console.log(rs)
    res.send({msg: 'sucess', state: '200', data: rs})
  })
})
// --------------------删除菜单节点-----------------
router.post('/tree/delete', function (req, res) {
  console.log('----------------------------删除菜单-------------------------------');
  let p = new Promise((resolve => {
    let delSts = true;
    let ids = function (query) {
      Menu.find(query, (err, doc) => {
        if (doc.length === 0) {
          return
        } else {
          for (let i = 0; i < doc.length; i++) {
            Menu.deleteMany({id: doc[i].id}, (error, dc1) => {
              if (error) {
                delSts = false;
              }
            });
            ids({parentId: doc[i].id});
          }
        }
      });
    };
    ids({id: req.body.id});
    resolve(delSts);
  }));
  p.then(data => {
    if (data) {
      res.send({msg: '删除成功', state: '200'})
    } else {
      res.send({msg: '删除失败', state: '99'})
    }
  })
});

module.exports = router;
