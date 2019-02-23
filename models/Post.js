let mongoose = require('mongoose');
let PostSchema = require('../schemas/PostSchema');
let Post = mongoose.model('post', PostSchema);
module.exports = Post;
