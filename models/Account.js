let mongoose = require('mongoose');
let AccountSchema = require('../schemas/AccountSchema');
let Account = mongoose.model('account', AccountSchema);
module.exports = Account;
