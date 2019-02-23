let mongoose = require('mongoose');
let BudgetSchema = require('../schemas/BudgetSchema');
let Budget = mongoose.model('budget', BudgetSchema);
module.exports = Budget;
