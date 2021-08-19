const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');
const uuid = require('uuid');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const {name} = file;
        cb(null, `${uuid.v4()}-${file.originalname}`);
    }
});
const uploadLink = multer({storage});

router.post('/add', uploadLink.single('pic'), async (req, res) => {
    const content = req.body.content;
    if (content.length < 512){
        await Post.create({content, imgSrc: req.file.path});
        res.redirect('/posts');
    } else {
        res.send({message: 'The content field is too long'});
    }
});

router.get('/posts', async(req, res) => {
    await Post.find({},function(err, content) {
        res.render('posts', { contents: content });
        res.redirect('/login');
    });
});


module.exports = router;