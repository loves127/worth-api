let mongoose = require('mongoose');
let CompanySchema = require('../schemas/CompanySchema');
let Company = mongoose.model('company', CompanySchema);
module.exports = Company
