//passport 기능만 따로 빼서 구현함. 

module.exports = function (app) {           //app에 대한 모듈이 없으니, app을 매개변수로 담아서 사용함. 

    var authData = {
        email: 'egoing777@gmail.com',
        password: '111111',
        nickname: 'egoing'
      };

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function (id, done) {
        done(null, authData);
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (username, password, done) {
            if (username === authData.email) {
                if (password === authData.password) {
                    return done(null, authData, {
                        message: 'Welcome.'
                    });
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));
    return passport;
}