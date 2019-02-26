let mongoose = require('mongoose');
let IdesNextSchema = require('../schemas/IdesNextSchema');
let IdsNext = mongoose.model('counter', IdesNextSchema);
module.exports = IdsNext
