let mongoose = require('mongoose');
let ManagerSchema = require('../schemas/ManagerSchema');
let Manager = mongoose.model('manager',ManagerSchema);
module.exports = Manager;
