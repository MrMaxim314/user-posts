require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const UserRouter = require('./routers/UserRouter');
const PostRouter = require('./routers/PostRouter');
const expressHbs = require("express-handlebars");


require('./passport-config')(passport);

const app = express();

const PORT = 3000;

app.engine('hbs', expressHbs(
    {
        layoutsDir: 'views',
        extname: 'hbs'
    }
))

app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('static'));
app.set('view engine', 'hbs');
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', UserRouter);
app.use('/', PostRouter);

app.get('/', (req, res) => {
    res.render('registration');
});

async function run(){
    try{
        await mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true, useNewUrlParser: true})
            .then(() => console.log('DB connected!'))
            .catch(error => console.log(error));
        app.listen(PORT, () => console.log(`Server is listening on ${PORT} port`));
    } catch (error) {
        console.log(error);
    }
}

run();
