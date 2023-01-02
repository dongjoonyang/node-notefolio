const express = require('express'); 
const router = express.Router();
const UserController = require('../../controllers/user/userController');

/**
* =======================================
* 설  명 : 카테고리
* =======================================
*/
/* default url : / */ 
router.get('/', function(req, res, next){ res.render('user/user.ejs'); });
router.get('/main/:mainId/off/:off', UserController.manageData);

/* 카테고리 목록 */
router.get('/category/data', UserController.catgoryData);

/* 서브 카테 게시판 목록 불러오기 */
router.get('/main/:mainId/sub/:subId/off/:off', UserController.subBoardData);

/* 게시판 글 읽기 */
router.get('/:idx/:mainId/:subId', UserController.boardRead);

module.exports = router;