var express = require('express');     // main.js로 접속한 다음 topic.js가 작동이 되미
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth');


router.get('/create', function (request, response) {      
  if (!auth.isOwner(request, response)) {                  // 인증을 제어하는 부분으로 해당 입력값이 로그인 되었는지 확인
    response.redirect('/');                                // 그리고 리다이렉트하여 홈 섹션으로 이동
    return false;
  }
  var title = 'WEB - create';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '', auth.statusUI(request, response));                 // 로그린을 나타내는 화면 
  response.send(html);
});

router.post('/create_process', function (request, response) {   // 생성 처리 프로세스도 동일하게 작동
  if (!auth.isOwner(request, response)) {
    response.redirect('/');                                    
    return false;
  }
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    response.redirect(`/topic/${title}`);
  });

});

router.get('/update/:pageId', function (request, response) {      // update하는 작동도 동일하게 적용
  if (!auth.isOwner(request, response)) {                         //authowner가 동일하게 작용되는 확인
    response.redirect('/');                 
    return false;
  }
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
        auth.statusUI(request, response)                  
      );
      response.send(html);
    });   
 
});

router.post('/update_process', function (request, response) {         // update 처리하는 코드도 동일하게 작용이 됨. 
  if (!auth.isOwner(request, response)) {                            // isOnwer가 동일하게 작동함
    response.redirect('/');                                       
    return false;
  }
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/topic/${title}`);
    })
  });
});

router.post('/delete_process', function (request, response) {     // deleter proecess도 또한 동일하게 작용함. 
  if (!auth.isOwner(request, response)) {
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    response.redirect('/');
  });

 
});

router.get('/:pageId', function (request, response, next) {                   // 해당 pageId를 파악하여 분석함. 
  var filteredId = path.parse(request.params.pageId).base;  
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if (err) {
      next(err);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`,
        auth.statusUI(request, response)
      );
      response.send(html);
    }
  });
});
module.exports = router; 