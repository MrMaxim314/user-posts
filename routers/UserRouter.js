const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('registration');
});

router.post('/register', passport.authenticate('local-reg', {
    successRedirect: '/posts',
    failureRedirect: '/register'
}));

router.get('/login', function(req, res){
    res.render('login',);
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/posts',
    failureRedirect: '/login',
}));

router.get('/posts', (req, res) => {
    res.render('posts');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;