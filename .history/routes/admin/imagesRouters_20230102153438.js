const express = require('express'); 
const router = express.Router();
const fs = require('fs'); // file 생성시 필요


/**
* =======================================
* 설  명 : uploads images 확인
* =======================================
*/ 
fs.readdir("/var", (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    console.log(file);
  });
});


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
