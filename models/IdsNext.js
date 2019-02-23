let mongoose = require('mongoose');
let IdesNextSchema = require('../schemas/IdesNextSchema');
let IdsNext = mongoose.model('counters', IdesNextSchema);
module.exports = IdsNext
