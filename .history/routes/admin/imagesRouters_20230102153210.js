// routers 에서 경로 바꿔주면서 fs에서 파일 받아와서 controller 에서 return 컨트롤러까지 존재
const express = require('express'); 
const router = express.Router();
const fs = require('fs'); // file 생성시 필요


/**
* =======================================
* 설  명 : uploads images 확인
* =======================================
*/ 
/* Default url : admin/images */ 
router.get('/', function(req, res, next){ 
    res.render('admin/images');
});

module.exports = router;
