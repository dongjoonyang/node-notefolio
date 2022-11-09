const Author = require("../../models/admin/author");

// 로그인 컨트롤러
exports.login = function(req, res){
  // :id 값으로 파라미터를 넘길때만 --> req.params 사용가능 -- 
  let id = req.body.id;
  let password = req.body.password;

  Author.login(id, password, function(err, result){
    // 폴더 model/author.js 에서에서 처리 후 쿼리 데이터를 넘겨받는 받음(mvc 공부 중일때 적은것)
    if (err) {
      res.send(err);
    } else { 
      if(result.length > 0){   
        // session 
        req.session.author = id;
        res.redirect('/admin/manage');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write("<script>alert('아이디 패스워드를 확인해 주세요')</script>");
        res.write("<script>window.location=\"/admin\"</script>");
      }
    }
  })
};

// 로그아웃 컨트롤러
exports.logout = function(req, res){
  if(req.session.author == undefined){
    console.log("로그인 에러");
    res.redirect('/admin');
  } else {
    req.session.destroy(
      function(err) {
        if(err) {
          console.log("세션 삭제 에러");
          return;
        }
        console.log("세션 삭제 성공");
        res.redirect('/admin');
      }
    );
  }
}

// 패스워드 찾기 컨트롤러
exports.password = function(req, res){
  let passwordHint = req.body.passwordHint;
  let responseData = {};

  if(passwordHint === "yangbankim"){
    Author.password(function(err, result){
      if(err){
        res.send(err);
      } else {
        responseData.password = result[0].password;
        responseData.flag = true;
        res.json(responseData);
      }
    });
  } else {
    responseData.flag = false;
    res.json(responseData);
  }
};

// 회원정보 페이지
exports.memberEdit = function(req, res){
  let authorId = req.session.author;
  res.render("admin/memberEdit", {id : authorId});
};


// 회원정보 수정 컨트롤러
exports.memberEditUpdate = function(req, res){
  let id = req.session.author;
  let newPassword = req.body.newPassword;

  if(req.session.author == undefined){
    res.write(`<script>
        alert('세션이 만료되었습니다..');
        document.location = '/admin';
      </script>`
    );
    
  } else {
    Author.memberEdit(id, newPassword, function(err, result){
      if(err){
        res.send(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write(`<script>
            alert('비밀번호가 변경되었습니다.');
            document.location = '/admin/manage';
          </script>`
        );
      }
    });
  }
};