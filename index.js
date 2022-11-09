const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;

 /**
 * =======================================
 * 설  명 : 모듈 
 * =======================================
 */
// 데이터베이스 연결
const db_config = require(__dirname + '/config/database.js');
const conn = db_config.init();
db_config.connect(conn);
// url 쿼리 문자열 
let qs = require('querystring');
// 쿠키 파서
let cookieParser = require('cookie-parser')
// 세션 파서
let expressSession = require('express-session');


/**
 * =======================================
 * 설  명 : app.use() 미들웨이 기능 마운트
 * =======================================
 */
// 정적 파일
app.use(express.static(__dirname + "/adm"));
app.use("/lib",express.static(__dirname + "/lib"));
// 쿠키 파서
app.use(cookieParser());
// 세션 파서
app.use(expressSession({
    secret: 'my key',   // 쿠키를 임의로 변조하는 것을 막음
    resave: false,       // 세션을 언제나 저장할지, false 권장
    saveUninitialized: false     // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
}));

/**
 * =======================================
 * 설  명 : 로그인
 * =======================================
 */
app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/adm/templates/login.html');
})

app.get('/adm', (req, res) => {
  return res.sendFile(__dirname + '/adm/templates/login.html');
})

app.post('/login_process', function (req, res) {
  let body = '';
  req.on('data', function(data){
    body = body + data;
  });
  
  req.on('end', function(){
    let post = qs.parse(body);

    // id password let
    let userid = post.id;
    let password = post.password;

    conn.query("SELECT * FROM author WHERE id = ? AND password = ?", [userid, password], function (err, result, fields) {
      if (err) {
        throw err
      } else { 
        if(result.length > 0){    // id check
          // session 
          req.session.user = userid;
          res.redirect("/manage");
        } else {
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.write("<script>alert('아이디 패스워드를 확인해 주세요')</script>");
          res.write("<script>window.location=\"/adm\"</script>");
        }
      }
    });
  })
});

/**
 * =======================================
 * 설  명 : 로그아웃
 * =======================================
 */
app.get('/logout', (req, res) => {
  if(req.session.user == undefined){
    console.log("로그인 안되어 있음");
    res.redirect('/');
  } else {
    req.session.destroy(
      function(err) {
        if(err) {
          console.log("세션 삭제 에러");
          return;
        }
        console.log("세션 삭제 성공");
        res.redirect('/');
      }
    );
  }
})

/**
 * =======================================
 * 설  명 : 비밀번호 찾기
 * =======================================
 */
app.get('/password', (req, res) => {
  return res.sendFile(__dirname + '/adm/templates/password.html');
})

app.post('/password_process', function (req, res) {
  let body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
    let post = qs.parse(body);
    let responseData = {};

    if(post.passwordHint === "yangbankim"){
        conn.query("SELECT * FROM AUTHOR", function (err, result, fields) {
          if (err) {
            throw err
          } else {
            responseData.passHint = result[0].password;
            responseData.flag = true;
            res.json(responseData);
          }
        });
    } else {
      responseData.flag = false;
      res.json(responseData);
    }
  });
});

/**
 * =======================================
 * 설  명 : 카테고리 관리
 * =======================================
 */
app.get('/manage', (req, res) => {
  if(req.session.user == undefined){res.redirect('/');} 
    
  return res.sendFile(__dirname + '/adm/templates/manage.html');
})

/**
 * =======================================
 * 설  명 : 비밀번호 변경
 * =======================================
 */
app.get('/memberEdit', (req, res) => {
  if(req.session.user == undefined){res.redirect('/');} 

  return res.sendFile(__dirname + '/adm/templates/memberEdit.html');
})

app.post('/memberEdit_process', (req, res) => {
  if(req.session.user == undefined){res.redirect('/');} 

  let body = '';      // 요청 데이터를 담을 변수
  req.on('data', function(data){    //요청
    body = body + data;   // 요청받은 데이터 저장
  }),
  req.on('end', function(){
    let post = qs.parse(body);    // 데이터를 객체로 받음
    conn.query("SELECT * FROM AUTHOR", function (err, result, fields) {
      if (err) {
        throw err
      } else {
        responseData.passHint = result[0].password;
        responseData.flag = true;
        res.json(responseData);
      }
    });
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})