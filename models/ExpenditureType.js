let mongoose = require('mongoose');
let ExpenditureTypeSchema = require('../schemas/ExpenditureTypeSchema');
let ExpenditureType = mongoose.model('expenditureType', ExpenditureTypeSchema);
module.exports = ExpenditureType;
