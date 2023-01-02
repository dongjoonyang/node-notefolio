const express = require('express'); 
const router = express.Router();
const AuthorController = require('../../controllers/admin/authorController');

/**
* =======================================
* 설  명 : 모듈
* =======================================
*/
const qs = require('querystring');    
console.log("11111");

/**
* =======================================
* 설  명 : 작가 라우터
* =======================================
*/
/* 로그인 라우터 */
router.get('/', function(req, res, next){ res.render('admin/login.ejs'); });
router.post('/loginProcess', AuthorController.login);

/* 로그아웃 라우터 */
router.get('/logout', AuthorController.logout);

/* 패스워드 찾기 라우터 */
router.get('/password', function(req, res, next){ res.render('admin/password.ejs'); });
router.post('/passwordProcess', AuthorController.password);

/* 회원정보 수정 관리 라우터 */
router.get('/memberEdit', AuthorController.memberEdit);
router.post('/memberEditProcess', AuthorController.memberEditUpdate);

module.exports = router;