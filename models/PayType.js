let mongoose = require('mongoose');
let PayTypeSchema = require('../schemas/PayTypeSchema');
let PayType = mongoose.model('payType', PayTypeSchema);
module.exports = PayType;
