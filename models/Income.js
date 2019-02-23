let mongoose = require('mongoose');
let IncomeSchema = require('../schemas/IncomeSchema');
let Income = mongoose.model('income', IncomeSchema);
module.exports = Income;
