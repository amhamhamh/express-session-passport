var express = require('express'); // 이 코드는 router로서 login과 logout을 확인하는 코드임
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js'); 

router.get('/login', function (request, response) {         // login을 확인하는 과정
  var fsmg = request.flash();                               
  var feedback='';
  if(fsmg.error){
      feedback = fsmg.error[0];                            // error 화면에 담아서 error출력한다.  
  }
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list,feedback           // 빨간색 태그를 담아서 보낸다. 
    `
    <div style='color:red;'>${feedback}</div>
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);
});

router.get('/logout', function (request, response) {      // logout은 아예 끊어서 session을 버림.   
  //request.session.destroy(function(err){  -데이터를 날려서 
    request.logout();                         // 로그아웃 시키거나
    request.session.save(function(){          // 아님 로그아웃 상태를 저장한다음에
      response.redirect('/');                // 홈으로 돌아오거나     
    });
  });
