let mongoose = require('mongoose');
let MenuSchema = require('../schemas/MenuSchema');
let Menu = mongoose.model('menu', MenuSchema);
module.exports = Menu;
