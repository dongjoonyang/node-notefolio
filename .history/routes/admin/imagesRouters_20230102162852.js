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
    let file = new Array();

    // upload images list
    fs.readdir("./public/uploads", (err, files) => {
        if (err) {
        throw err;
        }

        file = files;

        res.render('admin/images',{
            imgFile : file
        });
    });
});

module.exports = router;
