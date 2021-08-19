const mongoose = require('mongoose');

const Post = new mongoose.Schema({
   content: {
       type: String,
       required: true
   },
   imgSrc: {
       type: String,
       required: true
   }
});

module.exports = mongoose.model('Post', Post);