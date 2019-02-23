const mongoose = require('mongoose');
const config = require('./config');
mongoose.connect(config.mongodb)

mongoose.connection.on('connected', function () {
  console.log('-----------------数据库连接成功!----------------');
});

mongoose.connection.on('error',function (err) {
  console.log('-------------------数据库连接异常!------------------' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('-------------------数据库连接断开!-----------------');
});

module.exports = mongoose;
