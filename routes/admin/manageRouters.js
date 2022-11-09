const express = require('express'); 
const router = express.Router();
const ManageController = require('../../controllers/admin/manageController');
/**
* =======================================
* 설  명 : 카테고리 관리 라우터 
* =======================================
*/
/* default url : admin/manage */ 

/* 카테고리 관리 화면 + 메인 카테 게시판 목록 불러오기) */
router.get('/', function(req, res, next){ res.redirect('manage/1/page/1'); });
router.get('/:mainId/page/:page', ManageController.manageData);

/* 카테고리 Select 목록 */
router.get('/category/data', ManageController.manageCatgoryData);

/* 카테고리 Insert 매니저 */
router.post('/manageCategoryProcess', ManageController.manageCategory); 

/* 카테고리 Update 매니저 */
router.post('/manageCategoryUpdateProcess', ManageController.manageCategoryUpdate); 

/* 카테고리 Delete 매니저 */
router.delete('/category/:id', ManageController.manageCategoryDelete); 

/* 메인 카테 게시판 목록 불러오기 */
router.get('/main/:mainId/page/:page', ManageController.manageMainBoardData);

/* 서브 카테 게시판 목록 불러오기 */
router.get('/main/:mainId/sub/:subId/page/:page', ManageController.manageSubBoardData);


module.exports = router;