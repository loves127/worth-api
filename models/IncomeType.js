let mongoose = require('mongoose');
let IncomeTypeSchema = require('../schemas/IncomeTypeSchema');
let IncomeType = mongoose.model('incomeType', IncomeTypeSchema);
module.exports = IncomeType;
