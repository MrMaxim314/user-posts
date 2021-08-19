const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err,user);
        });
    });
    passport.use('local-reg', new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, login, password, done) {
            process.nextTick(function() {
                User.findOne({'local.login': login}, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false);
                    } else {
                        const newUser = new User();
                        newUser.login = login;
                        newUser.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, login, password, done) {
            User.findOne({login}, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false);

                if (!user.validPassword(password))
                    return done(null, false);

                return done(null, user);
            });

        }));

};