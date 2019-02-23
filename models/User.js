let mongoose = require('mongoose');
let UserSchema = require('../schemas/UserSchema');
let User = mongoose.model('user', UserSchema);
module.exports = User
