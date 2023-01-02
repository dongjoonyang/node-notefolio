// 1) 서버킴 : notefolio 폴더에서 npm run dev : 3000
// 2) 사스 : public > admin 폴더에서 node-sass --watch scss/main.scss css/main.css

/**
 * =======================================
 * 설  명 : 모듈 
 * =======================================
 */
const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;
const path = require("path");   // 유연한 디렉토리 
const cookieParser = require('cookie-parser')   // 쿠키 파서
const expressSession = require('express-session');    // 세션 파서
const ejs = require('ejs');  // ejs 템플릿

/**
* =======================================
* 설  명 : app.use() 미들웨이 기능 마운트
* =======================================
*/
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',   
    resave: false,
    saveUninitialized: false
}));

// req.body 사용하기 위한 미들웨어
app.use(express.json())
app.use(express.urlencoded({extends: true}))
 /**
  * =======================================
  * 설  명 : ejs 템플릿 설정
  * =======================================
  */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);

 /**
  * =======================================
  * 설  명 : 라우팅(routes)
  * =======================================
  */
 let userPages = require('./routes/user/userRouters.js');    // 유저 페이지
 let adminPages = require('./routes/admin/authorRouters.js');    // 관리자 로그인
 let managePages = require('./routes/admin/manageRouters.js');    // 카테고리 페이지
 let boardPages = require('./routes/admin/boardRouters.js');    // 게시판 관리
 let imagesPages = require('./routes/admin/imagesRouters.js');    // 이미지 관리

 app.use('/', userPages);

 app.use('/admin', adminPages);
 app.use('/admin/manage', managePages);
 app.use('/admin/board', boardPages);
 app.use('/admin/images', imagesPages);


 /**
  * =======================================
  * 설  명 : 서버 실행(포트 : 3000)
  * =======================================
  */

 // catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
