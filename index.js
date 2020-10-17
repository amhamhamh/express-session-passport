var express = require('express');  
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');                  
const flash = require('express-flash');

router.get('/', function (request, response) {
  var fsmg = request.flash();     // 인증에 성공했을 때 홈 화면으로 넘어온다.     
  var feedback ='';
  if(fsmg.success){               // 그랬을 당시에 fsmg.success가 성공일 때
    feedback = fsmg.success[0];    // fsmg.success를 feedback에 담아서  18번줄에 있는 줄을 참고하여 출력한다. 
  }
  var title = 'Welcome';    
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,             
      `
        <div style='color:blue;'>${feedback}</div> 
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
      `<a href="/topic/create">create</a>`,      
      auth.statusUI(request, response)         
    );
    response.send(html);
  });
  module.exports = router;