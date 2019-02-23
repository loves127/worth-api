let mongoose = require('mongoose');
let ExpenditureSchema = require('../schemas/ExpenditureSchema');
let Expenditure = mongoose.model('expenditure', ExpenditureSchema);
module.exports = Expenditure;
