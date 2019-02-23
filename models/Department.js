let mongoose = require('mongoose');
let DepartmentSchema = require('../schemas/DepartmentSchema');
let Department = mongoose.model('department', DepartmentSchema);
module.exports = Department
