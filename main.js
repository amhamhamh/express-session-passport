var express = require('express'); // main.js가 전체적으로 시스템 틀을 잡음. 
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
};
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {  // 이 코드는 로그인이 성공했을 떄 session에 정보를 저장하는 코드이다.
  console.log('serializeUser', user);           //user로 들어가서 done으로 전달한다. 
  done(null, user.email);
});

passport.deserializeUser(function(id, done) { // 이 코드는 session 저장된 정보를 조회할 때 쓰는 코드이다
  console.log('deserializeUser', id);         
  done(null, authData);                     // 저장된 session의 id로 조회하여,authData를 세팅한다. 
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function (username, password, done) {
    console.log('LocalStrategy', username, password);     
    if(username === authData.email){                    // 입력된 email 값이 맞을 떄
      console.log(1);
      if(password === authData.password){               // 입력된 password 값이 맞을 때
        console.log(2);
        return done(null, authData);                
      } else {
        console.log(3);
        return done(null, false, {                      // password가 틀릴 떄 실행
          message: 'Incorrect password.'
        });
      }
    } else {
      console.log(4);
      return done(null, false, {                      // id가 맞을 때 실행 
        message: 'Incorrect username.'
      });
    }
  }
));

app.post('/auth/login_process',               //로그인을 처리하는 과정
  passport.authenticate('local', {            //여기에서는 로컬 전략을 쓰고 있다. 
    successRedirect: '/',                     //성공하면 홈으로 가고
    failureRedirect: '/auth/login'            // 틀리면 auth/login 로그인 화면으로 다시 돌아간다. 
  }));
app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});